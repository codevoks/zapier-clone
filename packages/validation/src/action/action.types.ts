import { z } from 'zod'
import { ActionEmailSchema, ActionSolanaSchema, ActionHttpSchema } from './action.schema'

export type ActionEmailSchemaType = z.infer<typeof ActionEmailSchema>
export type ActionSolanaSchemaType = z.infer<typeof ActionSolanaSchema>
export type ActionHttpSchemaType = z.infer<typeof ActionHttpSchema>
