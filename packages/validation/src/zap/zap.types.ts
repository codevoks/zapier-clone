import { z, ZodError } from 'zod'
import { ZapCreteSchema } from './zap.schema'

export type ZapCreateType = z.infer<typeof ZapCreteSchema>
export type ParseResult =
  | { success: boolean; data: JSON }
  | { success: boolean; message: string }
  | { success: boolean; error: ZodError }
