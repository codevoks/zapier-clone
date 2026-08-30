import type { ZapRunExecution } from '@repo/db'

export type ActionItem = {
  type: 'email' | 'solana' | 'http'
  metadata: JSON
  payload: JSON
  order: number
}

export type ExecutionContext = {
  triggerPayload: Record<string, unknown>
  stepResults: Record<string, unknown>[]
  zapRunId: string
  zapRunExecutions: ZapRunExecution[]
}
