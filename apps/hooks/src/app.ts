import express from 'express'
import type { ErrorRequestHandler } from 'express'
import rateLimit from 'express-rate-limit'
import { prisma } from '@repo/db'
import { createLogger } from '@repo/logger'

const logger = createLogger('hooks')

export function createApp(): express.Express {
  const app = express()

  app.use(express.json({ limit: '256kb' }))

  // Malformed JSON should be a clean 400, not Express's default HTML error page.
  const jsonErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
      res.status(400).json({ error: 'Malformed JSON body' })
      return
    }
    next(err)
  }
  app.use(jsonErrorHandler)

  // Basic abuse protection. Note: this is per-process/in-memory, so it only
  // bounds a single instance - a real multi-instance deployment would need a
  // shared store (e.g. Redis) behind this. Documented limitation, not sold
  // as distributed rate limiting.
  const webhookLimiter = rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })

  app.post('/hooks/catch/:userid/:zapid', webhookLimiter, async (req, res) => {
    // Express 5 types named params as string | string[] to account for
    // repeated-segment routes; this route never produces an array.
    const userId = Number(req.params.userid as string)
    const zapId = req.params.zapid as string

    if (!Number.isFinite(userId) || !zapId) {
      return res.status(400).json({ error: 'Missing or invalid params' })
    }

    const zap = await prisma.zap.findFirst({
      where: { id: zapId, userId },
      include: { trigger: true },
    })
    if (!zap) {
      return res.status(404).json({ error: 'Zap not found' })
    }

    const configuredSecret = (zap.trigger?.metadata as { secret?: string } | null)?.secret
    if (configuredSecret) {
      const providedSecret = req.header('x-zap-secret')
      if (providedSecret !== configuredSecret) {
        logger.warn('Webhook rejected: secret mismatch', { zapId })
        return res.status(401).json({ error: 'Invalid webhook secret' })
      }
    }

    const body = req.body

    try {
      const zapRun = await prisma.$transaction(async tx => {
        const run = await tx.zapRun.create({
          data: { zapId, metadata: body },
        })
        await tx.zapRunOutBox.create({ data: { zapRunId: run.id } })
        return run
      })

      // Log payload shape, not contents - webhook bodies are third-party
      // controlled and may carry sensitive data.
      logger.info('Webhook accepted', {
        zapId,
        zapRunId: zapRun.id,
        payloadKeys: body && typeof body === 'object' ? Object.keys(body) : [],
      })

      // 202: durably recorded, not yet processed. The outbox processor and
      // worker pick it up asynchronously - this call never blocks on Kafka.
      return res.status(202).json({ message: 'Webhook received', zapRunId: zapRun.id })
    } catch (error) {
      logger.error('Failed to record webhook', { zapId, error })
      return res.status(500).json({ error: 'Failed to record webhook' })
    }
  })

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    logger.error('Unhandled error in hooks service', { error: err })
    res.status(500).json({ error: 'Internal error' })
  }
  app.use(errorHandler)

  return app
}
