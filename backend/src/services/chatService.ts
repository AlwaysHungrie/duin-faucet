import prisma from '../prisma'
import createError from 'http-errors'

export const getChats = async (userId: string) => {
  const limit = 5
  const chats = await prisma.chat.findMany({
    where: {
      userId,
    },
    include: {
      messages: {
        orderBy: {
          timestamp: 'desc',
        },
        take: limit*2 + 1,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  console.log('chats', chats)

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
      messages: chat.messages.slice(0, limit*2).reverse(),
      hasMoreMessages: chat.messages.length > limit*2,
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
    hasMoreMessages: false,
  }))
}

export const deleteChats = async (userId: string) => {
  await prisma.chat.deleteMany({
    where: {
      userId,
    },
  })
}

export const addUserMessage = async (chatId: string, message: string) => {
  const chat = await prisma.chat.findUnique({
    where: { chatId },
  })

  if (!chat) {
    throw createError(404, 'Chat not found')
  }

  if (chat.messagesRemaining <= 0) {
    throw createError(400, 'Chat has no remaining messages')
  }

  await prisma.chat.update({
    where: { chatId },
    data: { messagesRemaining: { decrement: 1 } },
  })

  const responseMessageContent = 'this is a response message' + message

  await prisma.message.create({
    data: {
      content: message,
      role: 'user',
      chatId,
    },
  })

  const responseMessage = await prisma.message.create({
    data: {
      content: responseMessageContent,
      role: 'assistant',
      chatId,
    },
  })

  return responseMessage
}

export const getPreviousMessages = async (chatId: string, beforeTimestamp: Date) => {
  const limit = 5
  const messages = await prisma.message.findMany({
    where: {
      chatId,
      timestamp: {
        lt: beforeTimestamp,
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
    take: limit*2 + 1,
  })

  return {
    messages: messages.slice(0, limit*2).reverse(),
    hasMoreMessages: messages.length > limit*2,
  }
}

export const clearChat = async (chatId: string) => {
  await prisma.message.deleteMany({
    where: { chatId },
  })

  await prisma.chat.update({
    where: { chatId },
    data: {
      messagesRemaining: 10,
      messagesResetTime: new Date(),
    },
  })
}
