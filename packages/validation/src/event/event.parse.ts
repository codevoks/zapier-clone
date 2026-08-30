import { ZapEventSchema } from './event.schema'
import type { ZapEvent } from './event.schema'

export type ZapEventParseResult =
  | { success: true; data: ZapEvent }
  | { success: false; error: string }

/**
 * Parses + validates a raw Kafka message value against the zap event
 * contract. Used by the worker to reject malformed/poison messages before
 * touching the database.
 */
export function safeParseZapEvent(raw: string | null | undefined): ZapEventParseResult {
  if (!raw) {
    return { success: false, error: 'Empty message value' }
  }
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return { success: false, error: 'Malformed JSON' }
  }
  const parsed = ZapEventSchema.safeParse(json)
  if (!parsed.success) {
    return { success: false, error: parsed.error.message }
  }
  return { success: true, data: parsed.data }
}
