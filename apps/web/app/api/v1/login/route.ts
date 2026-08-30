import { NextRequest, NextResponse } from 'next/server'
import { safeParseLogIn } from '@repo/validation'
import { verifyPassword, signJwt } from '@repo/auth'
import { findUser } from '@repo/db'
import { JWT_SECRET } from '../../../../lib/env'

export async function POST(Request: NextRequest) {
  try {
    const body = await Request.json()
    const parsedData = await safeParseLogIn(body)
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Log In Parsing Failed' },
        { status: 411 }
      )
    }
    const user = await findUser(parsedData.data.email)
    if (!user) {
      return NextResponse.json({
        error: 'User does not exist.',
        status: '404',
      })
    }
    const isPasswordValid = await verifyPassword(
      parsedData.data.password,
      user.password
    )
    if (!isPasswordValid) {
      return NextResponse.json({
        error: 'Incorrect password',
        status: '401',
      })
    }
    const token = await signJwt(
      { userId: user.id, email: user.email },
      JWT_SECRET
    )
    if (!token) {
      return NextResponse.json({
        error: 'Error creating login token.',
        status: '500',
      })
    }
    const response = NextResponse.redirect(new URL('/dashboard', Request.url))
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60,
    })
    return response
  } catch {
    return NextResponse.json(
      { error: 'Error while logging in' },
      { status: 400 }
    )
  }
}
