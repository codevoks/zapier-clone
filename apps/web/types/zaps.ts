export interface Zap {
  id: string
  triggerId: string
  userId: number
  actions: {
    id: string
    zapId: string
    actionId: string
  }[]
  trigger: {
    id: string
    zapid: string
    triggerId: string
    type: {
      id: string
      name: string
    }
  }
}
