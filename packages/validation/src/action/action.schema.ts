import { z } from 'zod'

export const ActionEmailSchema = z.object({
  toEmail: z.email(),
  subject: z.string().optional(),
  bodyTemplate: z.string().optional(),
})

export const ActionSolanaSchema = z.object({
  fromWalletId: z.string(),
  toAddress: z.string(),
  solanaAmount: z.number(),
})

export const ActionHttpSchema = z.object({
  url: z.url(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH']).default('POST'),
  headers: z.record(z.string(), z.string()).optional(),
  bodyTemplate: z.string().optional(),
})
