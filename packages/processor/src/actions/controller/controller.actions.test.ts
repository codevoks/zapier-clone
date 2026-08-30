import { describe, it, expect, vi, beforeEach } from 'vitest'

const upsertCalls: Array<{ zapRunId: string; stepOrder: number; status: string; message?: string | null }> = []

vi.mock('@repo/db', () => ({
  Status: { PROCESSING: 'PROCESSING', SUCCESS: 'SUCCESS', FAIL: 'FAIL' },
  upsertZapRunExecution: vi.fn(async (args: { zapRunId: string; stepOrder: number; status: string; message?: string | null }) => {
    upsertCalls.push(args)
    return args
  }),
}))

vi.mock('../service/processor.actions', () => ({
  executeAction: vi.fn(),
}))

vi.mock('@repo/logger', () => ({
  createLogger: () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}))

import { processActions } from './controller.actions'
import { executeAction } from '../service/processor.actions'
import type { ActionItem, ExecutionContext } from '../types/processor.types'

const mockedExecuteAction = vi.mocked(executeAction)

function makeContext(zapRunExecutions: ExecutionContext['zapRunExecutions'] = []): ExecutionContext {
  return {
    triggerPayload: {},
    stepResults: [],
    zapRunId: 'run-1',
    zapRunExecutions,
  }
}

const actions: ActionItem[] = [
  { type: 'http', metadata: {} as JSON, payload: {} as JSON, order: 0 },
  { type: 'http', metadata: {} as JSON, payload: {} as JSON, order: 1 },
  { type: 'http', metadata: {} as JSON, payload: {} as JSON, order: 2 },
]

beforeEach(() => {
  mockedExecuteAction.mockReset()
  upsertCalls.length = 0
})

describe('processActions', () => {
  it('runs actions in order and stops at the first failure', async () => {
    mockedExecuteAction
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: false, error: 'boom' })

    const result = await processActions(actions, makeContext())

    expect(result).toEqual({ success: false, error: 'boom' })
    expect(mockedExecuteAction).toHaveBeenCalledTimes(2)
    expect(mockedExecuteAction.mock.calls[0]![0]!.order).toBe(0)
    expect(mockedExecuteAction.mock.calls[1]![0]!.order).toBe(1)
    // Step 2 never runs because step 1 failed.
  })

  it('resumes from a partially-completed run without re-executing successful steps', async () => {
    const context = makeContext([
      { id: 'x', zapRunId: 'run-1', stepOrder: 0, status: 'SUCCESS' as never, message: JSON.stringify({ success: true, sent: true }) },
    ])
    mockedExecuteAction.mockResolvedValue({ success: true })

    const result = await processActions(actions, context)

    expect(result).toEqual({ success: true })
    expect(mockedExecuteAction).toHaveBeenCalledTimes(2)
    expect(mockedExecuteAction.mock.calls[0]![0]!.order).toBe(1)
    expect(mockedExecuteAction.mock.calls[1]![0]!.order).toBe(2)
    expect(context.stepResults[0]).toEqual({ success: true, sent: true })
  })

  it('is idempotent under redelivery: a second pass over an already-succeeded run calls no action handlers', async () => {
    mockedExecuteAction.mockResolvedValue({ success: true })
    const firstContext = makeContext()
    await processActions(actions, firstContext)
    expect(mockedExecuteAction).toHaveBeenCalledTimes(3)

    const executedState = actions.map(a => ({
      id: `exec-${a.order}`,
      zapRunId: 'run-1',
      stepOrder: a.order,
      status: 'SUCCESS' as never,
      message: JSON.stringify({ success: true }),
    }))
    mockedExecuteAction.mockClear()

    const secondResult = await processActions(actions, makeContext(executedState))

    expect(secondResult).toEqual({ success: true })
    expect(mockedExecuteAction).not.toHaveBeenCalled()
  })

  it('records SUCCESS/FAIL via upsertZapRunExecution for each attempted step', async () => {
    mockedExecuteAction
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: false, error: 'bad request' })

    await processActions(actions, makeContext())

    expect(upsertCalls).toEqual([
      expect.objectContaining({ stepOrder: 0, status: 'SUCCESS' }),
      expect.objectContaining({ stepOrder: 1, status: 'FAIL' }),
    ])
  })
})
