import { Kafka } from 'kafkajs'
import { prisma, Status } from '@repo/db'
import { processActions } from '@repo/processor'
import type { ActionItem } from '@repo/processor'
import type { ZapRunType } from '@repo/db'
import { safeParseZapEvent } from '@repo/validation'
import { createLogger } from '@repo/logger'
import { config } from './config'

const logger = createLogger('processor')

function buildExecutionPlan(zapRun: ZapRunType): ActionItem[] {
  return [...zapRun.zap.actions]
    .sort((a, b) => a.sortingOrder - b.sortingOrder)
    .map(entry => ({
      // entry.type.id is the canonical action id ('email'/'solana'/'http'),
      // seeded lowercase - unlike entry.type.name (the display label,
      // e.g. "HTTP Request"), it doesn't depend on the label staying a
      // single word that happens to lowercase into a valid handler key.
      type: entry.type.id as ActionItem['type'],
      metadata: entry.metadata as unknown as JSON,
      payload: zapRun.metadata as unknown as JSON,
      order: entry.sortingOrder,
    }))
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

type ProcessOutcome = { poison: boolean }

/**
 * Loads a zap run and drives it to completion. Terminal runs (already
 * SUCCESS/FAIL) are a cheap no-op so Kafka redelivery of an
 * already-finished run doesn't re-touch every step. Missing runs are
 * treated as poison (nothing sensible to retry).
 */
async function processZapRun(zapRunId: string, eventId: string): Promise<ProcessOutcome> {
  const zapRun = await prisma.zapRun.findUnique({
    where: { id: zapRunId },
    include: {
      zapRunExecutions: true,
      zap: {
        include: {
          trigger: { include: { type: true } },
          actions: { include: { type: true } },
        },
      },
    },
  })

  if (!zapRun) {
    logger.warn('zapRun not found - poison message', { zapRunId, eventId })
    return { poison: true }
  }

  if (zapRun.status === Status.SUCCESS || zapRun.status === Status.FAIL) {
    logger.info('zapRun already terminal - skipping redelivery', {
      zapRunId,
      eventId,
      status: zapRun.status,
    })
    return { poison: false }
  }

  if (!zapRun.startedAt) {
    await prisma.zapRun.update({ where: { id: zapRunId }, data: { startedAt: new Date() } })
  }

  const executionPlan = buildExecutionPlan(zapRun)
  const executionContext = {
    triggerPayload: zapRun.metadata as Record<string, unknown>,
    stepResults: [] as Record<string, unknown>[],
    zapRunId: zapRun.id,
    zapRunExecutions: zapRun.zapRunExecutions,
  }

  logger.info('Processing zap run', {
    zapRunId,
    eventId,
    zapId: zapRun.zap.id,
    steps: executionPlan.length,
  })

  const actionsResult = await processActions(executionPlan, executionContext)

  if (actionsResult.success) {
    await prisma.zapRun.update({
      where: { id: zapRunId },
      data: { status: Status.SUCCESS, completedAt: new Date(), error: null },
    })
    logger.info('zapRun succeeded', { zapRunId, eventId })
  } else {
    const message =
      actionsResult.error instanceof Error
        ? actionsResult.error.message
        : String(actionsResult.error ?? 'Unknown action failure')
    await prisma.zapRun.update({
      where: { id: zapRunId },
      data: { status: Status.FAIL, completedAt: new Date(), error: message },
    })
    logger.warn('zapRun failed', { zapRunId, eventId, error: message })
  }

  return { poison: false }
}

async function main() {
  const kafka = new Kafka({ clientId: config.kafkaClientId, brokers: config.kafkaBrokers })
  const consumer = kafka.consumer({ groupId: config.consumerGroup })
  await consumer.connect()
  await consumer.subscribe({ topic: config.kafkaTopic, fromBeginning: config.fromBeginning })
  logger.info('Processor subscribed', { topic: config.kafkaTopic, group: config.consumerGroup })

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ partition, message }) => {
      const commit = async () => {
        await consumer.commitOffsets([
          { topic: config.kafkaTopic, partition, offset: (parseInt(message.offset, 10) + 1).toString() },
        ])
      }

      const parsed = safeParseZapEvent(message.value?.toString())
      if (!parsed.success) {
        logger.warn('Poison message - failed to parse, committing without retry', {
          partition,
          offset: message.offset,
          error: parsed.error,
        })
        await commit()
        return
      }
      const event = parsed.data

      let attempt = 0
      while (true) {
        attempt += 1
        try {
          await processZapRun(event.zapRunId, event.eventId)
          await commit()
          return
        } catch (error) {
          if (attempt >= config.maxInfraRetries) {
            logger.error('Exhausted retries processing zap run; recording failure and committing', {
              zapRunId: event.zapRunId,
              eventId: event.eventId,
              attempt,
              error,
            })
            await prisma.zapRun
              .update({
                where: { id: event.zapRunId },
                data: {
                  status: Status.FAIL,
                  completedAt: new Date(),
                  error: `Worker error after ${attempt} attempts: ${error instanceof Error ? error.message : String(error)}`,
                },
              })
              .catch((updateError: unknown) => {
                logger.error('Failed to record terminal failure state', {
                  zapRunId: event.zapRunId,
                  error: updateError,
                })
              })
            await commit()
            return
          }
          logger.warn('Transient error processing zap run - retrying', {
            zapRunId: event.zapRunId,
            eventId: event.eventId,
            attempt,
            error,
          })
          await sleep(config.infraRetryBaseDelayMs * attempt)
        }
      }
    },
  })

  const shutdown = async (signal: string) => {
    logger.info('Shutting down processor', { signal })
    await consumer.disconnect()
    await prisma.$disconnect()
    process.exit(0)
  }
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
  process.on('SIGINT', () => void shutdown('SIGINT'))
}

main().catch(error => {
  logger.error('Fatal error starting processor', { error })
  process.exit(1)
})
