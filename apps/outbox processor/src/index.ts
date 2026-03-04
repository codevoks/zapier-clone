import { prisma } from '@repo/db'
import { Kafka } from 'kafkajs'

const TOPIC_NAME = 'zap-events'

const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092'],
})

async function main() {
  const producer = kafka.producer()
  await producer.connect()

  while (true) {
    const pendingRows = await prisma.zapRunOutBox.findMany({
      where: {},
      take: 10,
    })
    if (pendingRows.length > 0) {
      await producer.send({
        topic: TOPIC_NAME,
        messages: pendingRows.map(r => ({
          value: r.zapRunId,
        })),
      })

      await prisma.zapRunOutBox.deleteMany({
        where: {
          id: {
            in: pendingRows.map(x => x.id),
          },
        },
      })
      console.log('SENT to Kafka')
    }
  }
}

main()
