import { describe, it, expect, vi, beforeEach } from 'vitest'

const { sendEmail, sendSolana, sendHttp } = vi.hoisted(() => ({
  sendEmail: vi.fn(),
  sendSolana: vi.fn(),
  sendHttp: vi.fn(),
}))

vi.mock('./actions.service', () => ({ sendEmail, sendSolana, sendHttp }))
vi.mock('@repo/logger', () => ({
  createLogger: () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}))

import { executeAction } from './processor.actions'
import type { ActionItem, ExecutionContext } from '../types/processor.types'

const context: ExecutionContext = {
  triggerPayload: { name: 'Ada' },
  stepResults: [],
  zapRunId: 'run-1',
  zapRunExecutions: [],
}

beforeEach(() => {
  sendEmail.mockReset()
  sendSolana.mockReset()
  sendHttp.mockReset()
})

describe('executeAction - email', () => {
  it('fails validation when toEmail is missing', async () => {
    const item: ActionItem = { type: 'email', metadata: { subject: 'hi' } as unknown as JSON, payload: {} as JSON, order: 0 }
    const result = await executeAction(item, context)
    expect(result).toEqual({ success: false, error: "Receiver's email address missing." })
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('renders templates and passes a deterministic idempotency key', async () => {
    sendEmail.mockResolvedValue(undefined)
    const item: ActionItem = {
      type: 'email',
      metadata: { toEmail: 'a@b.com', subject: 'Hi {{payload.name}}', bodyTemplate: 'Body' } as unknown as JSON,
      payload: {} as JSON,
      order: 3,
    }
    const result = await executeAction(item, context)
    expect(result).toEqual({ success: true, sent: true })
    expect(sendEmail).toHaveBeenCalledWith({
      toEmail: 'a@b.com',
      subject: 'Hi Ada',
      bodyTemplate: 'Body',
      idempotencyKey: 'run-1:3',
    })
  })
})

describe('executeAction - solana', () => {
  it('fails validation when addresses are missing', async () => {
    const item: ActionItem = { type: 'solana', metadata: {} as JSON, payload: {} as JSON, order: 0 }
    const result = await executeAction(item, context)
    expect(result).toEqual({ success: false, error: "Sender/Receiver's address missing." })
  })

  it('rejects a non-positive amount', async () => {
    const item: ActionItem = {
      type: 'solana',
      metadata: { fromWalletId: 'A', toAddress: 'B', solanaAmount: -1 } as unknown as JSON,
      payload: {} as JSON,
      order: 0,
    }
    const result = await executeAction(item, context)
    expect(result).toEqual({ success: false, error: 'Enter valid amount' })
    expect(sendSolana).not.toHaveBeenCalled()
  })
})

describe('executeAction - http', () => {
  it('fails validation when url is missing', async () => {
    const item: ActionItem = { type: 'http', metadata: {} as JSON, payload: {} as JSON, order: 0 }
    const result = await executeAction(item, context)
    expect(result).toEqual({ success: false, error: 'URL missing.' })
    expect(sendHttp).not.toHaveBeenCalled()
  })

  it('sends the rendered body and reports the response status', async () => {
    sendHttp.mockResolvedValue({ status: 200, body: '{"ok":true}' })
    const item: ActionItem = {
      type: 'http',
      metadata: { url: 'https://example.com/hook', bodyTemplate: '{"name":"{{payload.name}}"}' } as unknown as JSON,
      payload: {} as JSON,
      order: 1,
    }
    const result = await executeAction(item, context)
    expect(result).toEqual({ success: true, sent: true, status: 200, response: '{"ok":true}' })
    expect(sendHttp).toHaveBeenCalledWith({
      url: 'https://example.com/hook',
      method: 'POST',
      headers: undefined,
      body: '{"name":"Ada"}',
      idempotencyKey: 'run-1:1',
    })
  })

  it('surfaces a failure result when the request throws', async () => {
    sendHttp.mockRejectedValue(new Error('HTTP 500: boom'))
    const item: ActionItem = {
      type: 'http',
      metadata: { url: 'https://example.com/hook' } as unknown as JSON,
      payload: {} as JSON,
      order: 0,
    }
    const result = await executeAction(item, context)
    expect(result).toEqual({ success: false, error: 'HTTP 500: boom' })
  })
})

describe('executeAction - unsupported type', () => {
  it('returns a failure instead of throwing', async () => {
    const item = { type: 'carrier-pigeon', metadata: {} as JSON, payload: {} as JSON, order: 0 } as unknown as ActionItem
    const result = await executeAction(item, context)
    expect(result.success).toBe(false)
  })
})
