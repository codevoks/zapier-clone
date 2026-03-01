import { ActionEmailSchema, ActionSolanaSchema } from './action.schema'

export function safeParseActionEmailSchema(input: unknown) {
  return ActionEmailSchema.safeParse(input)
}

export function safeParseActionSolanaSchemas(input: unknown) {
  return ActionSolanaSchema.safeParse(input)
}
