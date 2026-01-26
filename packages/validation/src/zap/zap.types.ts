import { z } from 'zod'
import { ZapCreteSchema } from './zap.schema.js'

export type ZapCreteType = z.infer<typeof ZapCreteSchema>
