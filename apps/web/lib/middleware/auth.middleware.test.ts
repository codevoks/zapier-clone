import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { signJwt } from '@repo/auth'
import authmiddleware from './auth.middleware'
import { JWT_SECRET } from '../env'

function makeRequest(path: string, token?: string) {
  const headers = new Headers()
  if (token) headers.set('cookie', `token=${token}`)
  return new NextRequest(new URL(`http://localhost${path}`), { headers })
}

describe('authmiddleware', () => {
  it('lets a request with a valid token pass through', async () => {
    const token = await signJwt({ userId: 1, email: 'a@b.com' }, JWT_SECRET)
    const res = await authmiddleware(makeRequest('/dashboard', token))
    expect(res.headers.get('x-middleware-next')).toBe('1')
  })

  it('redirects an unauthenticated page request to /login', async () => {
    const res = await authmiddleware(makeRequest('/dashboard'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/login')
  })

  it('returns 401 JSON for an unauthenticated API request instead of redirecting', async () => {
    const res = await authmiddleware(makeRequest('/api/v1/zap'))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  it('rejects a malformed/invalid token', async () => {
    const res = await authmiddleware(makeRequest('/api/v1/zap', 'not-a-real-jwt'))
    expect(res.status).toBe(401)
  })
})
