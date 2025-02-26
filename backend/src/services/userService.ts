import prisma from '../prisma'

export const createUser = async (privyUserId: string, address: string) => {
  const user = await prisma.user.create({
    data: {
      id: privyUserId,
      address,
    },
  })
  return user
}

export const getUserByAddress = async (address: string) => {
  const user = await prisma.user.findUnique({
    where: { address },
  })
  return user
}

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  })
  return user
}