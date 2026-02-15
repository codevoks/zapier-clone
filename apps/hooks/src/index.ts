import express from 'express'
import { prisma } from '@repo/db'

const app = express()

app.post('/hooks/catch/:userid/:zapid', async (req, res) => {
  const userId = req.params.userid
  const zapId = req.params.zapid
  const body = req.body

  if (!userId || !zapId) {
    return res.status(400).json({ error: 'Missing params' })
  }

  await prisma.$transaction(async tx => {
    const run = await tx.zapRun.create({
      data: {
        zapId: zapId,
        metadata: body,
      },
    })

    await tx.zapRunOutBox.create({
      data: {
        zapRunId: run.id,
      },
    })
  })
  res.json({
    message: 'Webhook Received',
  })
})

app.listen('4000')
