import { TRIGGER_IDS } from './trigger.constants'
import { TriggerWebhookSchema } from './trigger.schema'

export function safeParseTriggerWebhookSchema(input: unknown) {
  return TriggerWebhookSchema.safeParse(input)
}

export function safeParseTriggerSchema(triggerId: string, metadata: JSON) {
  if (!(triggerId in TRIGGER_IDS)) {
    return false
  }
  if (triggerId === TRIGGER_IDS.WEBHOOK) {
    return safeParseTriggerWebhookSchema(metadata)
  }
}
