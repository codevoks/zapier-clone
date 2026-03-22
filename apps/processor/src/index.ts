import { Kafka } from 'kafkajs'
import { prisma } from '@repo/db'
import { processActions } from '@repo/processor'
import type { ActionItem } from '@repo/processor'
import type { ZapRunType } from '@repo/db'

const TOPIC_NAME = 'zap-events'

const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092'],
})

function buildExecutionPlan(zapRun: ZapRunType) {
  const actionItems: ActionItem[] = zapRun.zap.actions
    .sort((a: ActionItem, b: ActionItem) => a.sortingOrder - b.sortingOrder)
    .map(
      (entry: ActionItem) =>
        ({
          type: entry.type.name,
          metadata: entry.metadata,
          payload: zapRun.metadata,
          order: entry.sortingOrder,
        }) as ActionItem
    )
  return actionItems
}

async function main() {
  try {
    const consumer = kafka.consumer({ groupId: 'main-worker' })
    await consumer.connect()

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })
    console.log('Processor consumer subscribed to topic', TOPIC_NAME)

    await consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        const commit = async () => {
          await consumer.commitOffsets([
            {
              topic: TOPIC_NAME,
              partition,
              offset: (parseInt(message.offset) + 1).toString(),
            },
          ])
        }
        const rawValue = message.value?.toString()
        console.log({
          partition,
          offset: message.offset,
          value: rawValue,
        })
        if (!rawValue) {
          console.log('Empty message received, skipping')
          await commit()
          return
        }

        console.log('Message received:', rawValue)
        let parsedValue: { zapRunId?: string; stage?: number }
        try {
          parsedValue = JSON.parse(rawValue)
        } catch (error) {
          console.log('Error parsing raw value ' + error)
          await commit()
          return
        }
        const zapRunId = parsedValue.zapRunId
        const stage = parsedValue.stage
        if (!zapRunId) {
          console.log(' No zapRunId received')
          await commit()
          return
        }
        try {
          const zapRun = await prisma.zapRun.findUnique({
            where: { id: zapRunId },
            include: {
              zapRunExecutions: true,
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
            await commit()
            return
          }
          console.log('ZapRun PAYLOAD => ' + JSON.stringify(zapRun.metadata))
          console.log('EXECUTION CONTEXT', {
            zapRunId: zapRunId,
            zapId: zapRun.zap.id,
            trigger: {
              type: zapRun.zap.trigger.type.name,
              metadata: zapRun.zap.trigger.metadata,
            },
            actions: zapRun.zap.actions.map((a: ActionItem) => ({
              id: a.id,
              type: a.type.name,
              sortingOrder: a.sortingOrder,
              metadata: a.metadata,
            })),
          })
          const executionPlan = buildExecutionPlan(zapRun)
          console.log('EXECUTION PLAN => ' + JSON.stringify(executionPlan))
          const executionContext = {
            triggerPayload: zapRun.metadata as Record<string, unknown>,
            stepResults: [] as Record<string, unknown>[],
            zapRunId: zapRun.id,
            zapRunExecutions: zapRun.zapRunExecutions,
          }
          const actionsResult = await processActions(
            executionPlan,
            executionContext
          )
          if (!actionsResult.success) {
            if (actionsResult.error instanceof Error) {
              console.log(actionsResult.error.message)
            } else {
              console.log(actionsResult.error)
            }
          }
          console.log({
            partition,
            offset: message.offset,
            value: message.value?.toString(),
          })
          await commit()
        } catch (error) {
          console.error('Error in each message ' + error)
          await commit()
        }
      },
    })
  } catch (error) {
    console.error('Error in processor ' + error)
  }
}

main()
