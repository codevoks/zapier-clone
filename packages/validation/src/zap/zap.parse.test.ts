import { describe, it, expect } from 'vitest'
import { safeParseZapCreteSchema, safeParseTriggersAndActions } from './zap.parse'

const validZap = {
  availableTriggerId: 'webhook',
  triggerMetadata: { secret: 'shh' },
  actions: [{ availableActionId: 'email', actionMetadata: { toEmail: 'a@b.com' } }],
}

describe('safeParseZapCreteSchema', () => {
  it('accepts a well-formed zap payload', () => {
    expect(safeParseZapCreteSchema(validZap).success).toBe(true)
  })

  it('rejects a payload missing the trigger id', () => {
    const { availableTriggerId, ...rest } = validZap
    void availableTriggerId
    expect(safeParseZapCreteSchema(rest).success).toBe(false)
  })

  it('rejects a payload with a non-array actions field', () => {
    expect(safeParseZapCreteSchema({ ...validZap, actions: 'not-an-array' }).success).toBe(false)
  })

  it('rejects completely malformed input', () => {
    expect(safeParseZapCreteSchema(null).success).toBe(false)
    expect(safeParseZapCreteSchema('garbage').success).toBe(false)
    expect(safeParseZapCreteSchema(42).success).toBe(false)
  })
})

describe('safeParseTriggersAndActions', () => {
  it('accepts a supported webhook trigger and a supported email action', () => {
    const parsed = safeParseZapCreteSchema(validZap)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(safeParseTriggersAndActions(parsed.data)).toBe(true)
    }
  })

  it('rejects an unsupported trigger id', () => {
    const parsed = safeParseZapCreteSchema({ ...validZap, availableTriggerId: 'carrier-pigeon' })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(safeParseTriggersAndActions(parsed.data)).toBe(false)
    }
  })

  it('rejects an action with invalid metadata for its type', () => {
    const parsed = safeParseZapCreteSchema({
      ...validZap,
      actions: [{ availableActionId: 'email', actionMetadata: { toEmail: 'not-an-email' } }],
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(safeParseTriggersAndActions(parsed.data)).toBe(false)
    }
  })

  it('accepts the new http action with a valid url', () => {
    const parsed = safeParseZapCreteSchema({
      ...validZap,
      actions: [{ availableActionId: 'http', actionMetadata: { url: 'https://example.com/hook' } }],
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(safeParseTriggersAndActions(parsed.data)).toBe(true)
    }
  })

  it('rejects the http action when the url is not a valid URL', () => {
    const parsed = safeParseZapCreteSchema({
      ...validZap,
      actions: [{ availableActionId: 'http', actionMetadata: { url: 'not-a-url' } }],
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(safeParseTriggersAndActions(parsed.data)).toBe(false)
    }
  })
})
