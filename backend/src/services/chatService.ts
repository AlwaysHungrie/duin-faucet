import prisma from '../prisma'

export const getChats = async (userId: string) => {
  const chats = await prisma.chat.findMany({
    where: {
      userId,
    },
    include: {
      messages: {
        orderBy: {
          timestamp: 'desc',
        },
        take: 10,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  if (chats && chats.length > 0) {
    const now = new Date();
    await Promise.all(chats.map(async (chat) => {
      const messageResetTime = new Date(chat.messagesResetTime);
      // if the message reset time is in the past, reset the messages
      if (messageResetTime < now) {
        await prisma.chat.updateMany({
          where: { chatId: chat.chatId },
          data: { messagesRemaining: chat.totalMessagesAllowed, messagesResetTime: now },
        });
      }
    }));
  }

  if (chats && chats.length > 0) {
    return chats.map((chat) => ({
      ...chat,
      messages: chat.messages.map((message) => ({
        content: message.content,
        timestamp: message.timestamp,
      })),
    }))
  }

  const now = new Date()
  // 12 hours from now
  const messagesResetTime = new Date(now.getTime() + 12 * 60 * 60 * 1000)

  const defaultChatNames = ['duin', 'scorekeeper', 'twitter helper']
  const defaultChats = await Promise.all(
    defaultChatNames.map((name) =>
      prisma.chat.create({
        data: {
          name,
          userId,
          totalMessagesAllowed: 10,
          messagesRemaining: 10,
          messagesResetTime,
          status: 'active',
        },
      })
    )
  )

  return defaultChats.map((chat) => ({
    ...chat,
    messages: [],
  }))
}

export const deleteChats = async (userId: string) => {
  await prisma.chat.deleteMany({
    where: {
      userId,
    },
  })
}