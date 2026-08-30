import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@repo/db'
import { verifyJwt } from '@repo/auth'
import { JWT_SECRET } from '../../../../../../lib/env'

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
    const availableActions = await prisma.avaialableAction.findMany({})
    return NextResponse.json(
      { availableActions: availableActions },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Error while fetching available triggers.' },
      { status: 500 }
    )
  }
}
