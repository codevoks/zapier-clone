import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString || typeof connectionString !== 'string') {
  throw new Error('DATABASE_URL is required. Set it in your environment or .env file.')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const availableTriggers = [
  {
    id: 'webhook',
    name: 'Web Hook',
    image: 'https://nordicapis.com/wp-content/uploads/Webhooks.fyi-Logo.png',
  },
]

const availableActions = [
  {
    id: 'email',
    name: 'Email',
    image: 'https://cdn-icons-png.flaticon.com/512/552/552486.png',
  },
  {
    id: 'solana',
    name: 'Solana',
    image: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png',
  },
  {
    id: 'http',
    name: 'HTTP Request',
    image: 'https://cdn-icons-png.flaticon.com/512/2222/2222051.png',
  },
]

async function main() {
  console.log('Seeding AvailableTrigger...')
  for (const trigger of availableTriggers) {
    await prisma.availableTrigger.upsert({
      where: { id: trigger.id },
      create: trigger,
      update: { name: trigger.name, image: trigger.image },
    })
  }
  console.log(`  ✓ ${availableTriggers.length} trigger(s) seeded`)

  console.log('Seeding AvaialableAction...')
  for (const action of availableActions) {
    await prisma.avaialableAction.upsert({
      where: { id: action.id },
      create: action,
      update: { name: action.name, image: action.image },
    })
  }
  console.log(`  ✓ ${availableActions.length} action(s) seeded`)

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
