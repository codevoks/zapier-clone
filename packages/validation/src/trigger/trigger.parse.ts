import { TRIGGER_IDS } from './trigger.constants'
import { TriggerWebhookSchema } from './trigger.schema'

function safeParseTriggerWebhookSchema(input: unknown) {
  return TriggerWebhookSchema.safeParse(input)
}

export function safeParseTriggerSchema(triggerId: string, metadata: JSON) {
  if (!Object.keys(TRIGGER_IDS).includes(triggerId)) {
    return false
  }
  if (triggerId === TRIGGER_IDS.WEBHOOK) {
    return safeParseTriggerWebhookSchema(metadata)
  }
}
