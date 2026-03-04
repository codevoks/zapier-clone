import { Kafka } from 'kafkajs'
import { prisma } from '@repo/db'
import { ActionItem } from '@repo/processor'
import { processActions } from '@repo/processor'

const TOPIC_NAME = 'zap-events'

const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092'],
})

async function debugRun() {
  const zapRun = await prisma.zapRun.findUnique({
    where: { id: '5141bc72-a6ba-489b-8cb7-6ba1c2cc96bf' },
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
  return zapRun
}

function buildExecutionPlan(zapRun) {
  const actionItems: ActionItem[] = zapRun.zap.actions
    .sort((a, b) => a.sortingOrder - b.sortingOrder)
    .map(
      entry =>
        ({
          type: entry.type.name,
          metadata: entry.metadata,
          payload: zapRun.metadata,
          order: entry.sortingOrder,
        }) as ActionItem
    )
  return actionItems
}

// async function main() {
//   try {
//     // const consumer = kafka.consumer({ groupId: 'main-worker' })
//     const consumer = kafka.consumer({ groupId: 'debug-worker' })
//     await consumer.connect()

//     await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })
//     console.log('Processor consumer subscribed to topic', TOPIC_NAME)
//     await consumer.run({
//       autoCommit: false,
//       eachMessage: async ({ topic, partition, message }) => {
//         console.log('Message received:', message.value?.toString())
//         const zapRunId = message.value?.toString()
//         if (!zapRunId) {
//           console.log(' No zapRunId received')
//           await consumer.commitOffsets([
//             {
//               topic: TOPIC_NAME,
//               partition: partition,
//               offset: (parseInt(message.offset) + 1).toString(),
//             },
//           ])
//           return
//         }
//         const zapRun = await prisma.zapRun.findUnique({
//           where: { id: zapRunId },
//           include: {
//             zap: {
//               include: {
//                 trigger: {
//                   include: { type: true },
//                 },
//                 actions: {
//                   include: { type: true },
//                 },
//               },
//             },
//           },
//         })
//         if (!zapRun) {
//           console.log('zapRun not found')
//           await consumer.commitOffsets([
//             {
//               topic: TOPIC_NAME,
//               partition: partition,
//               offset: (parseInt(message.offset) + 1).toString(),
//             },
//           ])
//           return
//         }
//         // console.log('ZAP=> ' + JSON.stringify(zapRun))
//         console.log('EXECUTION CONTEXT', {
//           zapRunId: zapRun.id,
//           zapId: zapRun.zap.id,
//           trigger: {
//             type: zapRun.zap.trigger.type.name,
//             metadata: zapRun.zap.trigger.metadata,
//           },
//           actions: zapRun.zap.actions.map(a => ({
//             id: a.id,
//             type: a.type.name,
//             sortingOrder: a.sortingOrder,
//             metadata: a.metadata,
//           })),
//         })
//         const executionPlan = buildExecutionPlan(zapRun)
//         console.log('EXECUTION PLAN => ' + JSON.stringify(executionPlan))
//         console.log({
//           partition,
//           offset: message.offset,
//           value: message.value?.toString(),
//         })
//         await consumer.commitOffsets([
//           {
//             topic: TOPIC_NAME,
//             partition: partition,
//             offset: (parseInt(message.offset) + 1).toString(),
//           },
//         ])
//       },
//     })

//     while (true) {}
//   } catch (error) {
//     console.error('Error in processor ' + error)
//   }
// }

async function main() {
  const zapRun = await debugRun()
  if (!zapRun) {
    console.log('ZapRun not found')
    return
  }

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
  console.log('EXECUTION PLAN =>', executionPlan)
  await processActions(executionPlan)
}

main()

/*
zapRun Trigger ?
plan ka output ?

zapRun hai kya ?
= Webhook ko receive karte time banta hai and body hi meta data hai
Trigger kaise karte hain ?
= webhook receive karke, perhaps.

*/
