import { describe, it, expect, vi, afterEach } from 'vitest'
import { createLogger } from './logger'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('createLogger', () => {
  it('emits single-line JSON on stdout for info, with service/level/msg and context merged in', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const logger = createLogger('test-service')
    logger.info('something happened', { zapRunId: 'run-1', attempt: 2 })

    expect(spy).toHaveBeenCalledTimes(1)
    const line = JSON.parse(spy.mock.calls[0]![0] as string)
    expect(line).toMatchObject({
      level: 'info',
      service: 'test-service',
      msg: 'something happened',
      zapRunId: 'run-1',
      attempt: 2,
    })
    expect(typeof line.timestamp).toBe('string')
  })

  it('routes warn/error to stderr so they are easy to filter on', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const logger = createLogger('test-service')

    logger.warn('careful')
    logger.error('boom')

    expect(errSpy).toHaveBeenCalledTimes(2)
    expect(logSpy).not.toHaveBeenCalled()
  })

  it('serializes Error context into message/stack instead of {}', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const logger = createLogger('test-service')
    logger.error('failed', { error: new Error('kaboom') })

    const line = JSON.parse(spy.mock.calls[0]![0] as string)
    expect(line.error.message).toBe('kaboom')
    expect(typeof line.error.stack).toBe('string')
  })
})
