import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@repo/db'
import { verifyJwt } from '@repo/auth'

const JWT_SECRET = 'shallom'

export async function GET(Request: NextRequest) {
  try {
    const token = Request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Login token not found.' },
        { status: 411 }
      )
    }
    const parsedToken = await verifyJwt(token, JWT_SECRET)
    if (!parsedToken?.userId) {
      return NextResponse.json({ error: 'Invalid Token.' }, { status: 411 })
    }
    const avaialableActions = await prisma.avaialableAction.findMany({})
    return NextResponse.json(
      { avaialableActions: avaialableActions },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error while fetching available triggers.' },
      { status: 500 }
    )
  }
}
