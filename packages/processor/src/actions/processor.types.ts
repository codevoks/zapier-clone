export type ActionItem = {
  type: 'email' | 'solana'
  metadata: JSON
  payload: JSON
  order: number
}

export type ExecutionContext = {
  triggerPayload: JSON
  stepResults: Record<number, JSON>
}
