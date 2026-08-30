import { describe, it, expect } from 'vitest'
import { safeParseZapEvent } from './event.parse'

const validEvent = {
  eventId: 'outbox-row-1',
  eventType: 'zap.run.created',
  version: 1,
  zapRunId: 'run-1',
  zapId: 'zap-1',
  occurredAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
}

describe('safeParseZapEvent', () => {
  it('accepts a well-formed event', () => {
    const result = safeParseZapEvent(JSON.stringify(validEvent))
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.zapRunId).toBe('run-1')
    }
  })

  it('rejects malformed JSON as a poison message', () => {
    const result = safeParseZapEvent('{not json')
    expect(result).toEqual({ success: false, error: 'Malformed JSON' })
  })

  it('rejects an empty/missing message value', () => {
    expect(safeParseZapEvent(undefined).success).toBe(false)
    expect(safeParseZapEvent(null).success).toBe(false)
    expect(safeParseZapEvent('').success).toBe(false)
  })

  it('rejects a payload missing zapRunId', () => {
    const { zapRunId, ...rest } = validEvent
    void zapRunId
    const result = safeParseZapEvent(JSON.stringify(rest))
    expect(result.success).toBe(false)
  })

  it('rejects an unknown event type/version (forward-compat guard)', () => {
    expect(safeParseZapEvent(JSON.stringify({ ...validEvent, eventType: 'zap.run.deleted' })).success).toBe(false)
    expect(safeParseZapEvent(JSON.stringify({ ...validEvent, version: 2 })).success).toBe(false)
  })
})
