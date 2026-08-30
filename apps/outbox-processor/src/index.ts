import { Kafka } from 'kafkajs'
import { prisma } from '@repo/db'
import { createLogger } from '@repo/logger'
import { config } from './config'
import { claimAndPublishBatch } from './claimAndPublish'

const logger = createLogger('outbox-processor')

async function main() {
  const kafka = new Kafka({ clientId: config.kafkaClientId, brokers: config.kafkaBrokers })
  const producer = kafka.producer()
  await producer.connect()
  logger.info('Outbox processor started', {
    topic: config.kafkaTopic,
    pollIntervalMs: config.pollIntervalMs,
    batchSize: config.batchSize,
  })

  let shuttingDown = false
  let timer: NodeJS.Timeout | undefined
  let inFlight: Promise<void> | undefined

  const scheduleNext = (delayMs: number) => {
    if (shuttingDown) return
    timer = setTimeout(() => void tick(), delayMs)
  }

  const tick = async () => {
    inFlight = (async () => {
      try {
        const result = await claimAndPublishBatch({
          prisma,
          producer,
          topic: config.kafkaTopic,
          batchSize: config.batchSize,
          maxAttempts: config.maxAttempts,
          logger,
        })
        // Drain immediately if we likely have more backlog; otherwise
        // fall back to the configured poll interval instead of hot-looping.
        const drained = result.outcome === 'published' && result.count === config.batchSize
        scheduleNext(drained ? 0 : config.pollIntervalMs)
      } catch (error) {
        logger.error('Unexpected error in outbox loop', { error })
        scheduleNext(config.pollIntervalMs)
      }
    })()
    await inFlight
  }

  const shutdown = async (signal: string) => {
    if (shuttingDown) return
    shuttingDown = true
    logger.info('Shutting down outbox processor', { signal })
    if (timer) clearTimeout(timer)
    if (inFlight) await inFlight
    await producer.disconnect()
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on('SIGTERM', () => void shutdown('SIGTERM'))
  process.on('SIGINT', () => void shutdown('SIGINT'))

  void tick()
}

main().catch(error => {
  logger.error('Fatal error starting outbox processor', { error })
  process.exit(1)
})
