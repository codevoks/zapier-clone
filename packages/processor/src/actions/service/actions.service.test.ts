import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const resendSend = vi.fn()
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: resendSend } })),
}))
vi.mock('@repo/logger', () => ({
  createLogger: () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}))

import { sendEmail, sendHttp } from './actions.service'

const originalFetch = global.fetch
const originalEnv = { ...process.env }

beforeEach(() => {
  resendSend.mockReset()
  process.env = { ...originalEnv }
})

afterEach(() => {
  global.fetch = originalFetch
})

describe('sendEmail', () => {
  it('is a no-op when RESEND_KEY/SEND_EMAIL are not configured (zero-cost local dev)', async () => {
    delete process.env.RESEND_KEY
    delete process.env.SEND_EMAIL
    await sendEmail({ toEmail: 'a@b.com', subject: 's', bodyTemplate: 'b', idempotencyKey: 'k' })
    expect(resendSend).not.toHaveBeenCalled()
  })

  it('forwards the idempotency key to Resend so redelivery cannot double-send', async () => {
    process.env.RESEND_KEY = 'test-key'
    process.env.SEND_EMAIL = 'from@example.com'
    resendSend.mockResolvedValue({ data: { id: '1' }, error: null })

    await sendEmail({ toEmail: 'a@b.com', subject: 's', bodyTemplate: 'b', idempotencyKey: 'run-1:0' })

    expect(resendSend).toHaveBeenCalledWith(
      { from: 'from@example.com', to: ['a@b.com'], subject: 's', text: 'b' },
      { idempotencyKey: 'run-1:0' }
    )
  })

  it('throws when Resend returns an error, so the caller can record a failed step', async () => {
    process.env.RESEND_KEY = 'test-key'
    process.env.SEND_EMAIL = 'from@example.com'
    resendSend.mockResolvedValue({ data: null, error: { message: 'invalid domain' } })

    await expect(
      sendEmail({ toEmail: 'a@b.com', subject: 's', bodyTemplate: 'b', idempotencyKey: 'k' })
    ).rejects.toBeTruthy()
  })
})

describe('sendHttp', () => {
  it('sends an idempotency-key header and returns the response on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '{"ok":true}' })
    global.fetch = fetchMock as unknown as typeof fetch

    const result = await sendHttp({ url: 'https://example.com', method: 'POST', body: '{}', idempotencyKey: 'run-1:2' })

    expect(result).toEqual({ status: 200, body: '{"ok":true}' })
    const [, init] = fetchMock.mock.calls[0]!
    expect((init as RequestInit).headers).toMatchObject({ 'idempotency-key': 'run-1:2' })
  })

  it('throws on a non-2xx response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'server error' })
    global.fetch = fetchMock as unknown as typeof fetch

    await expect(
      sendHttp({ url: 'https://example.com', method: 'POST', idempotencyKey: 'k' })
    ).rejects.toThrow('HTTP 500')
  })

  it('times out slow requests instead of hanging forever', async () => {
    process.env.ACTION_HTTP_TIMEOUT_MS = '10'
    const fetchMock = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
      return new Promise((_resolve, reject) => {
        init.signal?.addEventListener('abort', () => {
          const err = new Error('aborted')
          err.name = 'AbortError'
          reject(err)
        })
      })
    })
    global.fetch = fetchMock as unknown as typeof fetch

    await expect(
      sendHttp({ url: 'https://example.com', method: 'GET', idempotencyKey: 'k' })
    ).rejects.toThrow('timed out')
  })
})
