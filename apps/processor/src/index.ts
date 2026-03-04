import { Kafka } from 'kafkajs'
import { prisma } from '@repo/db'

const TOPIC_NAME = 'zap-events'

const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092'],
})

function buildExecutionPlan(zapRun) {
  return zapRun.zap.actions
    .sort((a, b) => a.sortingOrder - b.sortingOrder)
    .map(entry => ({
      type: entry.type.name,
      metadata: entry.metadata,
      payload: zapRun.metadata,
      order: entry.sortingOrder,
    }))
}

async function main() {
  try {
    const consumer = kafka.consumer({ groupId: 'main-worker' })
    await consumer.connect()

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

    await consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        const zapRunId = message.value?.toString()
        if (!zapRunId) {
          console.log(' No zapRunId received')
          await consumer.commitOffsets([
            {
              topic: TOPIC_NAME,
              partition: partition,
              offset: (parseInt(message.offset) + 1).toString(),
            },
          ])
          return
        }
        const zapRun = await prisma.zapRun.findUnique({
          where: { id: zapRunId },
          include: {
            zap: {
              include: {
                trigger: {
                  include: { type: true },
                },
                actions: {
                  include: { type: true },
                },
              },
            },
          },
        })
        if (!zapRun) {
          console.log('zapRun not found')
          await consumer.commitOffsets([
            {
              topic: TOPIC_NAME,
              partition: partition,
              offset: (parseInt(message.offset) + 1).toString(),
            },
          ])
          return
        }
        // console.log('ZAP=> ' + JSON.stringify(zapRun))
        console.log('EXECUTION CONTEXT', {
          zapRunId: zapRun.id,
          zapId: zapRun.zap.id,
          trigger: {
            type: zapRun.zap.trigger.type.name,
            metadata: zapRun.zap.trigger.metadata,
          },
          actions: zapRun.zap.actions.map(a => ({
            id: a.id,
            type: a.type.name,
            sortingOrder: a.sortingOrder,
            metadata: a.metadata,
          })),
        })
        const executionPlan = buildExecutionPlan(zapRun)
        console.log('EXECUTION PLAN => ' + JSON.stringify(executionPlan))
        console.log({
          partition,
          offset: message.offset,
          value: message.value?.toString(),
        })
        await consumer.commitOffsets([
          {
            topic: TOPIC_NAME,
            partition: partition,
            offset: (parseInt(message.offset) + 1).toString(),
          },
        ])
      },
    })

    while (true) {}
  } catch (error) {
    console.error('Error in processor ' + error)
  }
}
