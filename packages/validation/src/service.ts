import { SignUpSchema, LogInSchema } from './types.js'

export function safeParseSignUp(input: unknown) {
  return SignUpSchema.safeParse(input)
}

export function safeParseLogIn(input: unknown) {
  return LogInSchema.safeParse(input)
}
