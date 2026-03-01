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
  if (!safeParseTriggerSchema(triggerId, triggerMetadata)) {
    return false
  }
  newZap.actions.map(action => {
    if (
      !safeParseActionSchema(action.availableActionId, action.actionMetadata)
    ) {
      return false
    }
  })
  return true
}
