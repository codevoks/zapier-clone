import prisma from './client'
import { UserCreateInput } from './types'

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
