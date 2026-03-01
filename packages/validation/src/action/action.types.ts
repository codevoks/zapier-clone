import { z } from 'zod'
import { ActionEmailSchema, ActionSolanaSchema } from './action.schema'

export type ActionEmailSchemaType = z.infer<typeof ActionEmailSchema>
export type ActionSolanaSchemaType = z.infer<typeof ActionSolanaSchema>
