import { postRequest, updateRequest } from '../apiService'
import { ZapApiFnArgs, ZapApiFn } from '../types/zaps'

async function createZap({ selectedTrigger, actionsPayload }: ZapApiFnArgs) {
  return await postRequest({
    path: 'zap',
    data: {
      availableTriggerId: selectedTrigger?.availableTriggerId,
      triggerMetadata: selectedTrigger?.triggerMetadata ?? {},
      actions: actionsPayload,
    },
  })
}

async function updateZap({
  selectedTrigger,
  actionsPayload,
  zapId,
}: ZapApiFnArgs) {
  return await updateRequest({
    path: `zap/${zapId}`,
    data: {
      availableTriggerId: selectedTrigger?.availableTriggerId,
      triggerMetadata: selectedTrigger?.triggerMetadata ?? {},
      actions: actionsPayload,
    },
  })
}

export const ZAP_API_MAP: Record<'createZap' | 'updateZap', ZapApiFn> = {
  createZap: createZap,
  updateZap: updateZap,
}

export const ZAP_API_BUTTON_LABEL: Record<'createZap' | 'updateZap', string> = {
  createZap: 'Publish Zap',
  updateZap: 'Update Zap',
}

export const ZAP_API_SUCCESS_CODE: Record<'createZap' | 'updateZap', number> = {
  createZap: 201,
  updateZap: 200,
}

export const ZAP_API_SUCCESS_LABEL: Record<'createZap' | 'updateZap', string> =
  {
    createZap: 'Zap created successfully',
    updateZap: 'Zap updated successfully',
  }

export const ZAP_API_FAILURE_LABEL: Record<'createZap' | 'updateZap', string> =
  {
    createZap: 'Error while creating Zap',
    updateZap: 'Error while updating Zap',
  }
