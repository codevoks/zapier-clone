import { NextRequest, NextResponse } from 'next/server'
import { safeParseSignUp } from '@repo/validation'
import { findUser, createUser } from '@repo/db'

export async function POST(Request: NextRequest) {
  try {
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
    const newUser = await createUser(parsedData.data)
    return NextResponse.json(
      { messgae: JSON.stringify(newUser) },
      { status: 200 }
    )
    //return NextResponse.redirect(new URL('/new', request.url))
  } catch (error) {
    return NextResponse.json(
      { error: 'Error while Signing Up' },
      { status: 400 }
    )
  }
}
