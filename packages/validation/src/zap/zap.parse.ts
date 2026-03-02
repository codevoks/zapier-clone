import { safeParseActionSchema } from '../action'
import { safeParseTriggerSchema } from '../trigger'
import { ZapCreteSchema } from './zap.schema'
import type { ZapCreateType } from './zap.types'

export function safeParseZapCreteSchema(input: unknown) {
  return ZapCreteSchema.safeParse(input)
}

export function safeParseTriggersAndActions(newZap: ZapCreateType) {
  const triggerId = newZap.availableTriggerId
  const triggerMetadata = newZap.triggerMetadata
  const parsedTrigger = safeParseTriggerSchema(triggerId, triggerMetadata)
  if (!parsedTrigger.success) {
    return false
  }
  return newZap.actions.every(action => {
    const parsedAction = safeParseActionSchema(
      action.availableActionId,
      action.actionMetadata
    )
    if (!parsedAction.success) {
      return false
    }
    return true
  })
}
