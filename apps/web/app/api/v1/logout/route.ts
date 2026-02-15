import { NextRequest, NextResponse } from 'next/server'

export async function POST(Request: NextRequest) {
  try {
    const response = NextResponse.redirect(new URL('/', Request.url))
    response.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    })
    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Error while logging out' },
      { status: 500 }
    )
  }
}
