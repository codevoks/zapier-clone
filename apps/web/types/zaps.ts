export interface Zap {
  id: string
  triggerId: string
  userId: number
  actions: {
    id: string
    zapId: string
    actionId: string
    sortingOrder: number
    type: {
      id: string
      name: string
      image: string
    }
  }[]
  trigger: {
    id: string
    zapid: string
    triggerId: string
    type: {
      id: string
      name: string
      image: string
    }
  }
}

export interface AvailableTriggerType {
  availableTriggerId: string
  availableTriggerName: string
  triggerMetadata?: Record<string, unknown> | undefined
}

export interface AvailableActionType {
  index: number
  availableActionId: string
  availableActionName: string
  actionMetadata?: Record<string, unknown>
}
export interface ZapFormType {
  initialTrigger?: AvailableTriggerType
  initialActions?: AvailableActionType[]
  zapId?: string
  mode: 'createZap' | 'updateZap'
}

export type ZapApiFnArgs = {
  selectedTrigger: AvailableTriggerType
  actionsPayload: AvailableActionType[]
  zapId?: string
}

export type ZapApiResponse = { status: number }

export type ZapApiFn = (args: ZapApiFnArgs) => Promise<ZapApiResponse>
