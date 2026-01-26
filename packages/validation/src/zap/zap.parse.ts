import { ZapCreteSchema } from './zap.schema.js'

export function safeParseZapCreteSchema(input: unknown) {
  return ZapCreteSchema.safeParse(input)
}
