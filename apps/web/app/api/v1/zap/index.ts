import { NextRequest, NextResponse } from 'next/server'
import { safeParseZapCreteSchema } from '@repo/validation'
import { prisma } from '@repo/db'
import { verifyJwt } from '@repo/auth'

const JWT_SECRET = 'shallom'

export async function POST(Request: NextRequest) {
  try {
    const token = Request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({
        error: 'Login token not found.',
        status: 411,
      })
    }
    const parsedToken = await verifyJwt(token, JWT_SECRET)
    if (!parsedToken?.userId) {
      return NextResponse.json({
        error: 'Invalid Token.',
        status: 411,
      })
    }
    const userId = Number(parsedToken.userId)
    const body = await Request.json()
    const parsedBody = await safeParseZapCreteSchema(body)
    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Zap Parsing Failed' }, { status: 411 })
    }
    const newZap = await prisma.$transaction(async tx => {
      const zap = await tx.zap.create({
        data: {
          userId: userId,
          triggerId: '',
          actions: {
            create: parsedBody.data.actions.map((x, index) => ({
              actionId: x.availableActionId,
              sortingOrder: index,
            })),
          },
        },
      })

      const trigger = await tx.trigger.create({
        data: {
          triggerId: parsedBody.data.availableTriggerId,
          zapId: zap.id,
        },
      })

      await tx.zap.update({
        where: {
          id: zap.id,
        },
        data: {
          triggerId: trigger.id,
        },
      })
      return zap
    })
    return NextResponse.json({ zapId: newZap.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error while creating Zap' },
      { status: 500 }
    )
  }
}

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
    const userId = Number(parsedToken.userId)
    const zaps = await prisma.zap.findMany({
      where: {
        userId: userId,
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
    return NextResponse.json({ zaps }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error while fetching Zaps' },
      { status: 500 }
    )
  }
}
