import { z } from 'zod'

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
})

export const LogInSchema = z.object({
  email: z.string(),
  password: z.string(),
})
