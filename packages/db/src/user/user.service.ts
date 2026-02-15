import prisma from '../client/client'
import type { UserCreateInput } from './user.types'

export async function findUser(email: string) {
  try {
    return await prisma.user.findFirst({
      where: {
        email: email,
      },
    })
  } catch (error) {
    console.log('Error while finding the user.')
  }
}

export async function createUser(newUser: UserCreateInput) {
  try {
    return await prisma.user.create({
      data: newUser,
    })
  } catch (error) {
    console.log('Error while finding the user.')
  }
}

export async function findUserById(id: number) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    })
  } catch (error) {
    console.log('Error while finding the user.')
  }
}
