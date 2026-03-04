import { Kafka } from 'kafkajs'
import { prisma } from '@repo/db'

const TOPIC_NAME = 'zap-events'

const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092'],
})

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
        console.log('ZAP=> ' + JSON.stringify(zapRun))
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
