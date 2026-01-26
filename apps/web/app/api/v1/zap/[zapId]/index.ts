import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@repo/db'
import { verifyJwt } from '@repo/auth'

const JWT_SECRET = 'shallom'

export async function GET(
  Request: NextRequest,
  { params }: { params: { zapId: string } }
) {
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
    const userId = Number(parsedToken.userId)
    const zap = await prisma.zap.findFirst({
      where: {
        userId: userId,
        id: params.zapId,
      },
      include: {
        actions: {
          include: {
            type: true,
          },
        },
        trigger: {
          include: {
            type: true,
          },
        },
      },
    })
    if (!zap) {
      return NextResponse.json({ error: 'Zap not found.' }, { status: 404 })
    }
    return NextResponse.json({ zap }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error while fetching Zaps' },
      { status: 500 }
    )
  }
}
