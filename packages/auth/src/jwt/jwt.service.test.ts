import { describe, it, expect } from 'vitest'
import { signJwt, verifyJwt } from './jwt.service'

const SECRET = 'test-secret-value-that-is-long-enough'

describe('signJwt / verifyJwt', () => {
  it('round-trips a payload', async () => {
    const token = await signJwt({ userId: 42, email: 'a@b.com' }, SECRET)
    expect(token).toBeTruthy()
    const payload = await verifyJwt(token!, SECRET)
    expect(payload?.userId).toBe(42)
    expect(payload?.email).toBe('a@b.com')
  })

  it('rejects a token signed with a different secret', async () => {
    const token = await signJwt({ userId: 1, email: 'a@b.com' }, SECRET)
    const payload = await verifyJwt(token!, 'a-completely-different-secret-value')
    expect(payload).toBeUndefined()
  })

  it('rejects a tampered token', async () => {
    const token = await signJwt({ userId: 1, email: 'a@b.com' }, SECRET)
    const tampered = token!.slice(0, -2) + 'xx'
    const payload = await verifyJwt(tampered, SECRET)
    expect(payload).toBeUndefined()
  })

  it('rejects garbage input instead of throwing', async () => {
    const payload = await verifyJwt('not-a-jwt', SECRET)
    expect(payload).toBeUndefined()
  })
})
