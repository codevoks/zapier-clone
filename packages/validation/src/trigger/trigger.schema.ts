import { z } from 'zod'

export const TriggerWebhookSchema = z.object({
  url: z.string(),
  secret: z.string(),
})
