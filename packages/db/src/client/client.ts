import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  var prisma: PrismaClient | undefined
}
const connectionString = process.env.DATABASE_URL
if (!connectionString || typeof connectionString !== 'string') {
  throw new Error('DATABASE_URL is missing or invalid.')
}
const adapter = new PrismaPg({ connectionString })
const prisma = globalThis.prisma || new PrismaClient({ adapter })
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma
