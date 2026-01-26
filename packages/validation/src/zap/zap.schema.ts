import { z } from 'zod'

export const ZapCreteSchema = z.object({
  triggerId: z.string(),
  triggerMetadata: z.any().optional(),
  actions: z.array(
    z.object({
      actionId: z.string(),
      actionMetadata: z.any().optional(),
    })
  ),
})
