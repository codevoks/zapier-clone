import { TRIGGER_IDS } from './trigger.constants'
import { TriggerWebhookSchema } from './trigger.schema'
import type { ParseResult } from '../zap'

function safeParseTriggerWebhookSchema(input: unknown) {
  return TriggerWebhookSchema.safeParse(input)
}

export function safeParseTriggerSchema(triggerId: string, metadata: JSON) {
  if (!Object.values(TRIGGER_IDS).includes(triggerId)) {
    return { success: false, message: 'Unsupported Trigger.' } as ParseResult
  }
  if (triggerId === TRIGGER_IDS.WEBHOOK) {
    return safeParseTriggerWebhookSchema(metadata)
  }
  return {
    success: false,
    message: 'Invalid Trigger Structure.',
  } as ParseResult
}
