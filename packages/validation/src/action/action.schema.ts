import { z } from 'zod'

export const ActionEmailSchema = z.object({
  toEmail: z.email(),
  subject: z.string(),
  bodyTemplate: z.string(),
})

export const ActionSolanaSchema = z.object({
  fromWalletId: z.string(),
  toAddress: z.string(),
  amountLamports: z.string(),
})
