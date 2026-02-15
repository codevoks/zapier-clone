import { z } from 'zod'
import { SignUpSchema, LogInSchema } from './user.schema'

export type SignUpType = z.infer<typeof SignUpSchema>
export type LogInType = z.infer<typeof LogInSchema>
