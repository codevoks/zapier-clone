import { SignJWT, jwtVerify } from 'jose'
import type { JWTPayload } from 'jose'

export async function signJwt(payload: JWTPayload, JWT_SECRET: string) {
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET)
    return await new SignJWT(payload)
      .setProtectedHeader({
        alg: 'HS256',
      })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secretKey)
  } catch (error) {
    console.log('Token Signing Failed')
  }
}

export async function verifyJwt(token: string, JWT_SECRET: string) {
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (e) {
    console.log('Token is invalid')
  }
}
