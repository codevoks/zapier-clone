import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@repo/db'
import { verifyJwt } from '@repo/auth'
import { JWT_SECRET } from '../../../../../../lib/env'

const RUN_HISTORY_LIMIT = 25

export async function GET(
  Request: NextRequest,
  { params }: { params: Promise<{ zapId: string }> }
) {
  try {
    const { zapId } = await params
    const token = Request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Login token not found.' }, { status: 411 })
    }
    const parsedToken = await verifyJwt(token, JWT_SECRET)
    if (!parsedToken?.userId) {
      return NextResponse.json({ error: 'Invalid Token.' }, { status: 411 })
    }
    const userId = Number(parsedToken.userId)

    const zap = await prisma.zap.findFirst({ where: { id: zapId, userId } })
    if (!zap) {
      return NextResponse.json({ error: 'Zap not found.' }, { status: 404 })
    }

    const zapRuns = await prisma.zapRun.findMany({
      where: { zapId },
      orderBy: { createdAt: 'desc' },
      take: RUN_HISTORY_LIMIT,
      include: {
        zapRunExecutions: { orderBy: { stepOrder: 'asc' } },
      },
    })

    return NextResponse.json({ zapRuns }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Error while fetching zap runs' }, { status: 500 })
  }
}
