import { createApp } from './app'
import { createLogger } from '@repo/logger'

const logger = createLogger('hooks')
const app = createApp()
const port = Number(process.env.HOOKS_PORT) || 4000
app.listen(port, () => logger.info('Hooks service listening', { port }))
