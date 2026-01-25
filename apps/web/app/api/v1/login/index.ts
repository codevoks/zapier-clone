import { NextRequest, NextResponse } from 'next/server'
import { safeParseLogIn } from '@repo/validation'
import { findUser } from '@repo/db'

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
    const user = findUser(parsedData.data.email)
  } catch (error) {}
}
