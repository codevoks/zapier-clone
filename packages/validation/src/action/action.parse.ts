import { ACTION_IDS } from './action.constants'
import { ActionEmailSchema, ActionSolanaSchema } from './action.schema'

function safeParseActionEmailSchema(input: unknown) {
  return ActionEmailSchema.safeParse(input)
}

function safeParseActionSolanaSchemas(input: unknown) {
  return ActionSolanaSchema.safeParse(input)
}

export function safeParseActionSchema(actionId: string, actionMetadata: JSON) {
  if (!Object.keys(ACTION_IDS).includes(actionId)) {
    return false
  }
  if (actionId === ACTION_IDS.EMAIL) {
    return safeParseActionEmailSchema(actionMetadata)
  } else if (actionId === ACTION_IDS.SOLANA) {
    return safeParseActionSolanaSchemas(actionMetadata)
  }
}
