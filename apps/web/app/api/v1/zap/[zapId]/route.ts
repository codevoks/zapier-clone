import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@repo/db'
import { verifyJwt } from '@repo/auth'
import {
  safeParseZapCreteSchema,
  safeParseTriggersAndActions,
} from '@repo/validation'
import { JWT_SECRET } from '../../../../../lib/env'

export async function GET(
  Request: NextRequest,
  { params }: { params: Promise<{ zapId: string }> }
) {
  try {
    const { zapId } = await params
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
        id: zapId,
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
  } catch {
    return NextResponse.json(
      { error: 'Error while fetching Zaps' },
      { status: 500 }
    )
  }
}

export async function PUT(
  Request: NextRequest,
  { params }: { params: Promise<{ zapId: string }> }
) {
  try {
    const { zapId } = await params
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
    const body = await Request.json()
    const parsedBody = await safeParseZapCreteSchema(body)
    if (!parsedBody.success || !safeParseTriggersAndActions(parsedBody.data)) {
      return NextResponse.json({ error: 'Zap Parsing Failed' }, { status: 411 })
    }
    const newZap = await prisma.zap.update({
      where: {
        id: zapId,
        userId: userId,
      },
      data: {
        trigger: {
          update: {
            triggerId: parsedBody.data.availableTriggerId,
            metadata: parsedBody.data.triggerMetadata,
          },
        },
        actions: {
          deleteMany: {},
          create: parsedBody.data.actions.map((x, index) => ({
            actionId: x.availableActionId,
            sortingOrder: index,
            metadata: x.actionMetadata,
          })),
        },
      },
      include: {
        trigger: {
          include: {
            type: true,
          },
        },
        actions: {
          include: {
            type: true,
          },
        },
      },
    })

    return NextResponse.json({ zap: newZap }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Error while updating Zaps' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  Request: NextRequest,
  { params }: { params: Promise<{ zapId: string }> }
) {
  try {
    const { zapId } = await params
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
    const zap = await prisma.zap.delete({
      where: {
        id: zapId,
        userId: userId,
      },
    })

    return NextResponse.json({ zap: zap }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Error while deleting Zap' },
      { status: 500 }
    )
  }
}
