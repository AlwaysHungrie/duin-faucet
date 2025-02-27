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

export const deleteUser = async (userId: string) => {
  const chats = await prisma.chat.findMany({
    where: { userId },
  })

  const messages = await prisma.message.deleteMany({
    where: { chatId: { in: chats.map((chat) => chat.chatId) } },
  })

  console.log('deleted messages', messages)
  console.log('deleted chats', chats)

  await prisma.chat.deleteMany({
    where: { userId },
  })

  // await prisma.user.delete({ where: { id: userId } })
}
