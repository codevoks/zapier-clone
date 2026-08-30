import { ZAP_EVENT_TYPES } from '@repo/validation'
import type { ZapEvent } from '@repo/validation'
import type { PrismaClient } from '@repo/db'
import type { Logger } from '@repo/logger'

type ClaimedRow = { id: string; zapRunId: string }

export type KafkaSender = {
  send: (record: { topic: string; messages: { key: string; value: string }[] }) => Promise<unknown>
}

export type ClaimAndPublishDeps = {
  prisma: PrismaClient
  producer: KafkaSender
  topic: string
  batchSize: number
  maxAttempts: number
  logger: Logger
}

export type ClaimAndPublishResult =
  | { outcome: 'empty' }
  | { outcome: 'published'; count: number }
  | { outcome: 'failed'; count: number; deadLettered: number }

/**
 * Claims a batch of pending outbox rows, publishes them to Kafka, and
 * deletes them - all inside one Postgres transaction using
 * `FOR UPDATE SKIP LOCKED` so multiple processor instances can run
 * concurrently without double-claiming the same rows.
 *
 * Delivery semantics: deletion is the acknowledgement. If this process
 * crashes after `producer.send()` succeeds but before the transaction
 * commits, Postgres rolls the delete back and the row is published again on
 * the next poll - i.e. Kafka delivery here is at-least-once, not
 * exactly-once. Downstream consumers must be idempotent (see the worker).
 */
export async function claimAndPublishBatch(deps: ClaimAndPublishDeps): Promise<ClaimAndPublishResult> {
  const { prisma, producer, topic, batchSize, maxAttempts, logger } = deps
  let claimed: ClaimedRow[] = []

  try {
    const publishedCount = await prisma.$transaction(
      async tx => {
        const rows = await tx.$queryRaw<ClaimedRow[]>`
          SELECT id, "zapRunId"
          FROM "ZapRunOutBox"
          WHERE "deadLetteredAt" IS NULL AND "nextAttemptAt" <= now()
          ORDER BY "createdAt" ASC
          LIMIT ${batchSize}
          FOR UPDATE SKIP LOCKED
        `
        if (rows.length === 0) return 0
        claimed = rows

        // Observability only - correctness comes from FOR UPDATE SKIP LOCKED
        // + the transaction boundary, not from this timestamp.
        await tx.zapRunOutBox.updateMany({
          where: { id: { in: rows.map(r => r.id) } },
          data: { lockedAt: new Date() },
        })

        const zapRuns = await tx.zapRun.findMany({
          where: { id: { in: rows.map(r => r.zapRunId) } },
          select: { id: true, zapId: true, createdAt: true },
        })
        const zapRunById = new Map(zapRuns.map(z => [z.id, z]))
        const publishedAt = new Date().toISOString()

        const messages = rows.map(row => {
          const zapRun = zapRunById.get(row.zapRunId)
          const event: ZapEvent = {
            eventId: row.id,
            eventType: ZAP_EVENT_TYPES.RUN_CREATED,
            version: 1,
            zapRunId: row.zapRunId,
            zapId: zapRun?.zapId ?? '',
            occurredAt: (zapRun?.createdAt ?? new Date()).toISOString(),
            publishedAt,
          }
          // Keyed by zapId so every run of the same zap lands in one
          // partition and is observed in order.
          return { key: event.zapId || event.zapRunId, value: JSON.stringify(event) }
        })

        await producer.send({ topic, messages })

        await tx.zapRunOutBox.deleteMany({ where: { id: { in: rows.map(r => r.id) } } })
        return rows.length
      },
      { timeout: 15_000 }
    )

    if (publishedCount === 0) return { outcome: 'empty' }
    logger.info('Published outbox batch', { count: publishedCount })
    return { outcome: 'published', count: publishedCount }
  } catch (error) {
    if (claimed.length === 0) {
      logger.error('Failed to claim outbox batch', { error })
      return { outcome: 'empty' }
    }
    const deadLettered = await recordPublishFailure(prisma, claimed, error, maxAttempts, logger)
    return { outcome: 'failed', count: claimed.length, deadLettered }
  }
}

async function recordPublishFailure(
  prisma: PrismaClient,
  rows: ClaimedRow[],
  error: unknown,
  maxAttempts: number,
  logger: Logger
): Promise<number> {
  const ids = rows.map(r => r.id)
  const message = error instanceof Error ? error.message : String(error)
  const result = await prisma.$queryRaw<{ id: string; deadLettered: boolean }[]>`
    UPDATE "ZapRunOutBox"
    SET
      attempts = attempts + 1,
      "lastError" = ${message},
      "nextAttemptAt" = now() + LEAST(interval '30 seconds', (attempts + 1) * interval '2 seconds'),
      "deadLetteredAt" = CASE WHEN attempts + 1 >= ${maxAttempts} THEN now() ELSE "deadLetteredAt" END
    WHERE id = ANY(${ids}::text[])
    RETURNING id, ("deadLetteredAt" IS NOT NULL) AS "deadLettered"
  `
  const deadLettered = result.filter(r => r.deadLettered).length
  logger.warn('Outbox publish failed; scheduled retry/backoff', {
    count: rows.length,
    deadLettered,
    error: message,
  })
  return deadLettered
}
