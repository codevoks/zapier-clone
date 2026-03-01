import { ACTION_IDS } from './action.constants'
import { ActionEmailSchema, ActionSolanaSchema } from './action.schema'

export function safeParseActionEmailSchema(input: unknown) {
  return ActionEmailSchema.safeParse(input)
}

export function safeParseActionSolanaSchemas(input: unknown) {
  return ActionSolanaSchema.safeParse(input)
}

export function safeParseActionSchema(actionId: string, actionMetadata: JSON) {
  if (!(actionId in ACTION_IDS)) {
    return false
  }
  if (actionId === ACTION_IDS.EMAIL) {
    return safeParseActionEmailSchema(actionMetadata)
  } else if (actionId === ACTION_IDS.SOLANA) {
    return safeParseActionSolanaSchemas(actionMetadata)
  }
}
