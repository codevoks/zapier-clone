import { Prisma } from '../../generated/prisma/client'
export type ZapCreateInput = Prisma.ZapCreateInput
export type ZapRunType = Prisma.ZapRunGetPayload<{
  include: {
    zap: {
      include: {
        trigger: {
          include: { type: true }
        }
        actions: {
          include: { type: true }
        }
      }
    }
  }
}>

export type TriggerType = ZapRunType['zap']['trigger']
export type ActionType = ZapRunType['zap']['actions'][number]

export type ZapRunOutBoxType = Prisma.ZapRunOutBoxGetPayload<{
  include: {
    zapRun: true
  }
}>
