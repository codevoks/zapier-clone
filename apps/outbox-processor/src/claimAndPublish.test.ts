import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { prisma } from '@repo/db'
import { createLogger } from '@repo/logger'
import { claimAndPublishBatch } from './claimAndPublish'
import type { KafkaSender } from './claimAndPublish'

const logger = createLogger('test')
let userId: number
let zapId: string
const createdZapRunIds: string[] = []

async function makeZapRun() {
  const zapRun = await prisma.zapRun.create({
    data: { zapId, metadata: { hello: 'world' } },
  })
  await prisma.zapRunOutBox.create({ data: { zapRunId: zapRun.id } })
  createdZapRunIds.push(zapRun.id)
  return zapRun
}

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      name: 'Outbox Test User',
      email: `outbox-test-${Date.now()}@example.com`,
      password: 'not-a-real-hash',
    },
  })
  userId = user.id
  const zap = await prisma.zap.create({ data: { userId, triggerId: '' } })
  zapId = zap.id
})

afterAll(async () => {
  await prisma.zap.deleteMany({ where: { userId } })
  await prisma.user.delete({ where: { id: userId } })
  await prisma.$disconnect()
})

afterEach(async () => {
  // Clean up anything a test didn't already consume.
  await prisma.zapRunOutBox.deleteMany({ where: { zapRunId: { in: createdZapRunIds } } })
  createdZapRunIds.length = 0
})

describe('claimAndPublishBatch', () => {
  it('publishes pending rows and deletes them (ack = deletion)', async () => {
    const zapRun = await makeZapRun()
    const sent: { topic: string; messages: { key: string; value: string }[] }[] = []
    const producer: KafkaSender = {
      send: async record => {
        sent.push(record)
      },
    }

    const result = await claimAndPublishBatch({
      prisma,
      producer,
      topic: 'zap-events',
      batchSize: 10,
      maxAttempts: 5,
      logger,
    })

    expect(result).toEqual({ outcome: 'published', count: 1 })
    expect(sent).toHaveLength(1)
    const event = JSON.parse(sent[0]!.messages[0]!.value)
    expect(event).toMatchObject({
      eventType: 'zap.run.created',
      version: 1,
      zapRunId: zapRun.id,
      zapId,
    })

    const remaining = await prisma.zapRunOutBox.findUnique({ where: { zapRunId: zapRun.id } })
    expect(remaining).toBeNull()
  })

  it('returns "empty" when there is nothing to claim', async () => {
    const producer: KafkaSender = { send: async () => {} }
    const result = await claimAndPublishBatch({
      prisma,
      producer,
      topic: 'zap-events',
      batchSize: 10,
      maxAttempts: 5,
      logger,
    })
    expect(result).toEqual({ outcome: 'empty' })
  })

  it('backs off and records the error when publishing fails, without deleting the row', async () => {
    const zapRun = await makeZapRun()
    const producer: KafkaSender = {
      send: async () => {
        throw new Error('kafka is down')
      },
    }

    const result = await claimAndPublishBatch({
      prisma,
      producer,
      topic: 'zap-events',
      batchSize: 10,
      maxAttempts: 5,
      logger,
    })
    expect(result).toEqual({ outcome: 'failed', count: 1, deadLettered: 0 })

    const row = await prisma.zapRunOutBox.findUnique({ where: { zapRunId: zapRun.id } })
    expect(row).not.toBeNull()
    expect(row!.attempts).toBe(1)
    expect(row!.lastError).toContain('kafka is down')
    expect(row!.nextAttemptAt.getTime()).toBeGreaterThan(Date.now())
    expect(row!.deadLetteredAt).toBeNull()
  })

  it('dead-letters a row once it exceeds maxAttempts and stops claiming it', async () => {
    const zapRun = await makeZapRun()
    const producer: KafkaSender = {
      send: async () => {
        throw new Error('still down')
      },
    }

    for (let i = 0; i < 2; i++) {
      const result = await claimAndPublishBatch({
        prisma,
        producer,
        topic: 'zap-events',
        batchSize: 10,
        maxAttempts: 2,
        logger,
      })
      expect(result.outcome).toBe('failed')
      // Force the row to be immediately reclaimable for the next iteration.
      await prisma.zapRunOutBox.updateMany({
        where: { zapRunId: zapRun.id },
        data: { nextAttemptAt: new Date() },
      })
    }

    const row = await prisma.zapRunOutBox.findUnique({ where: { zapRunId: zapRun.id } })
    expect(row!.attempts).toBe(2)
    expect(row!.deadLetteredAt).not.toBeNull()

    // A dead-lettered row must never be claimed again.
    const healthyProducer: KafkaSender = { send: async () => {} }
    const result = await claimAndPublishBatch({
      prisma,
      producer: healthyProducer,
      topic: 'zap-events',
      batchSize: 10,
      maxAttempts: 2,
      logger,
    })
    expect(result).toEqual({ outcome: 'empty' })
  })

  it('never lets two concurrent claimers publish the same row (FOR UPDATE SKIP LOCKED)', async () => {
    await makeZapRun()
    await makeZapRun()
    const seenByA: string[] = []
    const seenByB: string[] = []
    const producerA: KafkaSender = {
      send: async record => {
        for (const m of record.messages) seenByA.push(JSON.parse(m.value).zapRunId)
      },
    }
    const producerB: KafkaSender = {
      send: async record => {
        for (const m of record.messages) seenByB.push(JSON.parse(m.value).zapRunId)
      },
    }

    await Promise.all([
      claimAndPublishBatch({ prisma, producer: producerA, topic: 'zap-events', batchSize: 1, maxAttempts: 5, logger }),
      claimAndPublishBatch({ prisma, producer: producerB, topic: 'zap-events', batchSize: 1, maxAttempts: 5, logger }),
    ])

    const overlap = seenByA.filter(id => seenByB.includes(id))
    expect(overlap).toHaveLength(0)
    expect(seenByA.length + seenByB.length).toBeGreaterThanOrEqual(1)
  })
})
