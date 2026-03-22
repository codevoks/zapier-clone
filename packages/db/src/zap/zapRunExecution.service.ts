import prisma from '../client/client'
import type { Status } from '../../generated/prisma/enums'

export async function upsertZapRunExecution({
  zapRunId,
  stepOrder,
  status,
  message,
}: {
  zapRunId: string
  stepOrder: number
  status: Status
  message?: string | null
}) {
  return prisma.zapRunExecution.upsert({
    where: {
      zapRunId_stepOrder: {
        zapRunId,
        stepOrder,
      },
    },
    create: {
      zapRunId,
      stepOrder,
      status,
      message: message ?? null,
    },
    update: {
      status,
      ...(message !== undefined ? { message } : {}),
    },
  })
}
