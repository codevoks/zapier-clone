import { z } from 'zod'

export const ZAP_EVENT_TYPES = {
  RUN_CREATED: 'zap.run.created',
} as const

export const ZapEventSchema = z.object({
  eventId: z.string(),
  eventType: z.literal(ZAP_EVENT_TYPES.RUN_CREATED),
  version: z.literal(1),
  zapRunId: z.string(),
  zapId: z.string(),
  occurredAt: z.string(),
  publishedAt: z.string(),
})

export type ZapEvent = z.infer<typeof ZapEventSchema>
