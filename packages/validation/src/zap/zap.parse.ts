import { ZapCreteSchema } from './zap.schema'

export function safeParseZapCreteSchema(input: unknown) {
  return ZapCreteSchema.safeParse(input)
}
