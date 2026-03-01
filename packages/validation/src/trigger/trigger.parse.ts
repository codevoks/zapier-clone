import { TriggerWebhookSchema } from './trigger.schema'

export function safeParseTriggerWebhookSchema(input: unknown) {
  return TriggerWebhookSchema.safeParse(input)
}
