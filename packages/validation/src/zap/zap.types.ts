import { z } from 'zod'
import { ZapCreteSchema } from './zap.schema'

export type ZapCreteType = z.infer<typeof ZapCreteSchema>
