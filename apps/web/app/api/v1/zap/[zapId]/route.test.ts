import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { NextRequest } from 'next/server'
import { signJwt } from '@repo/auth'
import { prisma } from '@repo/db'
import { JWT_SECRET } from '../../../../../lib/env'
import { GET, DELETE } from './route'

let ownerId: number
let otherUserId: number
let zapId: string
let ownerToken: string
let otherToken: string

beforeAll(async () => {
  const owner = await prisma.user.create({
    data: { name: 'Owner', email: `owner-${Date.now()}@example.com`, password: 'hash' },
  })
  const other = await prisma.user.create({
    data: { name: 'Other', email: `other-${Date.now()}@example.com`, password: 'hash' },
  })
  ownerId = owner.id
  otherUserId = other.id

  const zap = await prisma.zap.create({ data: { userId: ownerId, triggerId: '' } })
  zapId = zap.id

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
  return new NextRequest(new URL(`http://localhost/api/v1/zap/${zapId}`), { headers })
}

describe('GET /api/v1/zap/[zapId]', () => {
  it('returns the zap to its owner', async () => {
    const res = await GET(makeRequest(ownerToken), { params: Promise.resolve({ zapId }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.zap.id).toBe(zapId)
  })

  it('returns 404 for a different, authenticated user (no cross-user access)', async () => {
    const res = await GET(makeRequest(otherToken), { params: Promise.resolve({ zapId }) })
    expect(res.status).toBe(404)
  })

  it('returns 411 when there is no auth token at all', async () => {
    const res = await GET(makeRequest(), { params: Promise.resolve({ zapId }) })
    expect(res.status).toBe(411)
  })
})

describe('DELETE /api/v1/zap/[zapId]', () => {
  it('cascades through ZapRun -> ZapRunExecution/ZapRunOutBox instead of failing on FK constraints', async () => {
    const zap = await prisma.zap.create({ data: { userId: ownerId, triggerId: '' } })
    const run = await prisma.zapRun.create({ data: { zapId: zap.id, metadata: {} } })
    await prisma.zapRunExecution.create({
      data: { zapRunId: run.id, stepOrder: 0, status: 'SUCCESS', message: 'ok' },
    })
    await prisma.zapRunOutBox.create({ data: { zapRunId: run.id } })

    const token = (await signJwt({ userId: ownerId, email: 'owner-delete-test@example.com' }, JWT_SECRET))!
    const req = new NextRequest(new URL(`http://localhost/api/v1/zap/${zap.id}`), {
      headers: new Headers({ cookie: `token=${token}` }),
    })
    const res = await DELETE(req, { params: Promise.resolve({ zapId: zap.id }) })
    expect(res.status).toBe(200)

    expect(await prisma.zap.findUnique({ where: { id: zap.id } })).toBeNull()
    expect(await prisma.zapRun.findUnique({ where: { id: run.id } })).toBeNull()
  })
})
