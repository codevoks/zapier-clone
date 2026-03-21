import { z } from 'zod'

export const TriggerWebhookSchema = z.object({
  secret: z.string().optional(),
})
