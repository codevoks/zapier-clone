import { z } from 'zod'
import { TriggerWebhookSchema } from './trigger.schema'

export type TriggerWebhook = z.infer<typeof TriggerWebhookSchema>
