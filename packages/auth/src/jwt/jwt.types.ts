import type { JWTPayload } from 'jose'

export interface JwtPayLoad extends JWTPayload {
  userId: number
  email: string
}
