import prisma from '../client/client.js'
import type { ZapCreateInput } from './zap.types.js'

export async function createZap(newZap: ZapCreateInput) {
  try {
    return await prisma.zap.create({
      data: newZap,
    })
  } catch (error) {
    console.log('Error while finding the user.')
  }
}
