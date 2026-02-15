import { NextRequest, NextResponse } from 'next/server'
import { safeParseSignUp } from '@repo/validation'
import { hashPassword, signJwt } from '@repo/auth'
import { findUser, createUser } from '@repo/db'

const SALT_ROUNDS = 10
const JWT_SECRET = 'shallom'

export async function POST(Request: NextRequest) {
  try {
    console.log('INSIDE POST SIGNUP')
    const body = await Request.json()
    const parsedData = safeParseSignUp(body)
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Sign Up Parsing Failed' },
        { status: 411 }
      )
    }
    const user = await findUser(parsedData.data.email)
    if (user) {
      return NextResponse.json(
        { error: 'User Already Exists' },
        { status: 403 }
      )
    }
    const newUser = await createUser({
      name: parsedData.data.name,
      email: parsedData.data.email,
      password: await hashPassword(parsedData.data.password, SALT_ROUNDS),
    })
    if (!newUser) {
      return NextResponse.json(
        { error: 'Could Not Create User' },
        { status: 403 }
      )
    }
    const token = await signJwt(
      { userId: newUser.id, email: parsedData.data.email },
      JWT_SECRET
    )
    if (!token) {
      return NextResponse.json(
        { error: 'Error creating login token.' },
        { status: 500 }
      )
    }
    const response = NextResponse.redirect(new URL('/dashboard', Request.url))
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60,
    })
    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Error while signing up' },
      { status: 400 }
    )
  }
}
