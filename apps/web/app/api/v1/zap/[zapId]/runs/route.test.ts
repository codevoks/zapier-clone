import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { NextRequest } from 'next/server'
import { signJwt } from '@repo/auth'
import { prisma } from '@repo/db'
import { JWT_SECRET } from '../../../../../../lib/env'
import { GET } from './route'

let ownerId: number
let otherUserId: number
let zapId: string
let ownerToken: string
let otherToken: string

beforeAll(async () => {
  const owner = await prisma.user.create({
    data: { name: 'Runs Owner', email: `runs-owner-${Date.now()}@example.com`, password: 'hash' },
  })
  const other = await prisma.user.create({
    data: { name: 'Runs Other', email: `runs-other-${Date.now()}@example.com`, password: 'hash' },
  })
  ownerId = owner.id
  otherUserId = other.id

  const zap = await prisma.zap.create({ data: { userId: ownerId, triggerId: '' } })
  zapId = zap.id
  await prisma.zapRun.create({ data: { zapId, metadata: {}, status: 'SUCCESS' } })

  ownerToken = (await signJwt({ userId: ownerId, email: owner.email }, JWT_SECRET))!
  otherToken = (await signJwt({ userId: otherUserId, email: other.email }, JWT_SECRET))!
})

afterAll(async () => {
  await prisma.zap.deleteMany({ where: { userId: { in: [ownerId, otherUserId] } } })
  await prisma.user.deleteMany({ where: { id: { in: [ownerId, otherUserId] } } })
  await prisma.$disconnect()
})

function makeRequest(token?: string) {
  const headers = new Headers()
  if (token) headers.set('cookie', `token=${token}`)
  return new NextRequest(new URL(`http://localhost/api/v1/zap/${zapId}/runs`), { headers })
}

describe('GET /api/v1/zap/[zapId]/runs', () => {
  it("returns the owner's run history", async () => {
    const res = await GET(makeRequest(ownerToken), { params: Promise.resolve({ zapId }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.zapRuns).toHaveLength(1)
    expect(body.zapRuns[0].status).toBe('SUCCESS')
  })

  it('returns 404 for a different user', async () => {
    const res = await GET(makeRequest(otherToken), { params: Promise.resolve({ zapId }) })
    expect(res.status).toBe(404)
  })
})
