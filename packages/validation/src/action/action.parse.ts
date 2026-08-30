import { ACTION_IDS } from './action.constants'
import { ActionEmailSchema, ActionSolanaSchema, ActionHttpSchema } from './action.schema'
import type { ParseResult } from '../zap'

function safeParseActionEmailSchema(input: unknown) {
  return ActionEmailSchema.safeParse(input)
}

function safeParseActionSolanaSchemas(input: unknown) {
  return ActionSolanaSchema.safeParse(input)
}

function safeParseActionHttpSchema(input: unknown) {
  return ActionHttpSchema.safeParse(input)
}

export function safeParseActionSchema(actionId: string, actionMetadata: JSON) {
  if (!Object.values(ACTION_IDS).includes(actionId)) {
    return { success: false, message: 'Unsupported Action.' } as ParseResult
  }
  if (actionId === ACTION_IDS.EMAIL) {
    return safeParseActionEmailSchema(actionMetadata)
  } else if (actionId === ACTION_IDS.SOLANA) {
    return safeParseActionSolanaSchemas(actionMetadata)
  } else if (actionId === ACTION_IDS.HTTP) {
    return safeParseActionHttpSchema(actionMetadata)
  }
  return {
    success: false,
    message: 'Invalid Action Structure.',
  } as ParseResult
}
