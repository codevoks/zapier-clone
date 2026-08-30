import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import { prisma } from '@repo/db'
import { createApp } from './app'

const app = createApp()

let userId: number
let openZapId: string
let securedZapId: string
const createdZapRunIds: string[] = []

beforeAll(async () => {
  await prisma.availableTrigger.upsert({
    where: { id: 'webhook' },
    create: { id: 'webhook', name: 'Web Hook', image: '' },
    update: {},
  })

  const user = await prisma.user.create({
    data: {
      name: 'Hooks Test User',
      email: `hooks-test-${Date.now()}@example.com`,
      password: 'not-a-real-hash',
    },
  })
  userId = user.id

  const openZap = await prisma.zap.create({ data: { userId, triggerId: '' } })
  openZapId = openZap.id

  const securedZap = await prisma.zap.create({ data: { userId, triggerId: '' } })
  securedZapId = securedZap.id
  const trigger = await prisma.trigger.create({
    data: { zapId: securedZapId, triggerId: 'webhook', metadata: { secret: 'top-secret' } },
  })
  await prisma.zap.update({ where: { id: securedZapId }, data: { triggerId: trigger.id } })
})

afterAll(async () => {
  await prisma.zap.deleteMany({ where: { userId } })
  await prisma.user.delete({ where: { id: userId } })
  await prisma.$disconnect()
})

afterEach(async () => {
  if (createdZapRunIds.length > 0) {
    await prisma.zapRunOutBox.deleteMany({ where: { zapRunId: { in: createdZapRunIds } } })
    await prisma.zapRun.deleteMany({ where: { id: { in: createdZapRunIds } } })
    createdZapRunIds.length = 0
  }
})

describe('POST /hooks/catch/:userid/:zapid', () => {
  it('durably records a ZapRun + outbox row and returns 202', async () => {
    const res = await request(app)
      .post(`/hooks/catch/${userId}/${openZapId}`)
      .send({ hello: 'world' })

    expect(res.status).toBe(202)
    expect(res.body.zapRunId).toBeTruthy()
    createdZapRunIds.push(res.body.zapRunId)

    const zapRun = await prisma.zapRun.findUnique({ where: { id: res.body.zapRunId } })
    expect(zapRun).not.toBeNull()
    expect(zapRun!.metadata).toEqual({ hello: 'world' })

    const outbox = await prisma.zapRunOutBox.findUnique({ where: { zapRunId: res.body.zapRunId } })
    expect(outbox).not.toBeNull()
  })

  it('returns 404 for a zap that does not exist / does not belong to the user', async () => {
    const res = await request(app)
      .post(`/hooks/catch/${userId}/00000000-0000-0000-0000-000000000000`)
      .send({})
    expect(res.status).toBe(404)
  })

  it('returns 400 for malformed JSON instead of an HTML error page', async () => {
    const res = await request(app)
      .post(`/hooks/catch/${userId}/${openZapId}`)
      .set('Content-Type', 'application/json')
      .send('{not valid json')
    expect(res.status).toBe(400)
    expect(res.headers['content-type']).toMatch(/json/)
  })

  it('rejects a secured webhook when the secret is missing or wrong', async () => {
    const missing = await request(app).post(`/hooks/catch/${userId}/${securedZapId}`).send({})
    expect(missing.status).toBe(401)

    const wrong = await request(app)
      .post(`/hooks/catch/${userId}/${securedZapId}`)
      .set('x-zap-secret', 'nope')
      .send({})
    expect(wrong.status).toBe(401)
  })

  it('accepts a secured webhook when the secret matches', async () => {
    const res = await request(app)
      .post(`/hooks/catch/${userId}/${securedZapId}`)
      .set('x-zap-secret', 'top-secret')
      .send({})
    expect(res.status).toBe(202)
    createdZapRunIds.push(res.body.zapRunId)
  })

  it('does not require a secret when the trigger has none configured (public webhook)', async () => {
    const res = await request(app).post(`/hooks/catch/${userId}/${openZapId}`).send({})
    expect(res.status).toBe(202)
    createdZapRunIds.push(res.body.zapRunId)
  })
})
