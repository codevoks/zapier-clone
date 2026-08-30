import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJwt } from '@repo/auth'
import { JWT_SECRET } from '../env'

const API_PREFIX = '/api/'

// Defense in depth: this middleware gates the page/API routes listed in
// proxy.ts's matcher, in addition to (not instead of) each API route's own
// JWT check. Without it, an unauthenticated request could still render
// /dashboard or /zap/* client-side before the page's own data fetches fail.
export default async function authmiddleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isApiRoute = request.nextUrl.pathname.startsWith(API_PREFIX)

  if (!token) {
    return unauthorized(request, isApiRoute)
  }

  const payload = await verifyJwt(token, JWT_SECRET)
  if (!payload?.userId) {
    return unauthorized(request, isApiRoute)
  }

  return NextResponse.next()
}

function unauthorized(request: NextRequest, isApiRoute: boolean) {
  if (isApiRoute) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }
  const loginUrl = new URL('/login', request.url)
  return NextResponse.redirect(loginUrl)
}
