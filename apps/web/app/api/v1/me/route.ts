import { NextRequest, NextResponse } from 'next/server'
import { verifyJwt } from '@repo/auth'
import { findUserById } from '@repo/db'

const JWT_SECRET = 'shallom'

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('token')?.value
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication token not found.' },
        { status: 401 }
      )
    }
    const parsedToken = await verifyJwt(authToken, JWT_SECRET)
    if (!parsedToken) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }
    const userInfo = await findUserById(Number(parsedToken.userId))
    if (!userInfo) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }
    return NextResponse.json({
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error in me route' }, { status: 500 })
  }
}
