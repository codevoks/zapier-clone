import prisma from '../client/client'
import type { ZapCreateInput } from './zap.types'

export async function createZap(newZap: ZapCreateInput) {
  try {
    return await prisma.zap.create({
      data: newZap,
    })
  } catch (error) {
    console.log('Error while finding the zap.')
  }
}
