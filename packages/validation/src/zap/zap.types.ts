import { z } from 'zod'
import { ZapCreteSchema } from './zap.schema'

export type ZapCreateType = z.infer<typeof ZapCreteSchema>
