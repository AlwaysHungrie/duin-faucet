import { Message } from '@prisma/client'
import prisma from '../prisma'
import createError from 'http-errors'
import { executeLLM } from './llmService'
import config from '../config'
import {
  DUIN_SYSTEM_PROMPT,
  SCOREKEEPER_SYSTEM_PROMPT,
} from '../constants/systemPrompts'
import {
  checkIfSystemPromptInRequest,
  extractAttestationUrls,
  extractMessageFromRecv,
} from '../utils/userMessageUtils'
import { executeVerifier } from './llmVerifierService'

const { OPENAI_API_KEY } = config

const defaultChatNames = ['duin', 'scorekeeper']
const defaultChatTotalMessagesAllowed = 10

const defaultMessage = {
  duin: `Greetings, seeker of knowledge! I am the Duin, ready to assess the merits of your creation. Share with me my Scorekeeper's findings, and I shall render my mystical judgment upon your work and grant you the tools to develop it further.`,
  scorekeeper: `Hey there! I'm Duin's scorekeeper. I will provide detailed feedback and a scorecard for your project idea. You can download each message I send as an attestation of your scorecard and use it while you're talking to Duin.`,
}
const defaultTools = [
  {
    type: 'function',
    function: {
      name: 'send_eth',
      description: 'Send ETH to the user',
      parameters: {
        type: 'object',
        properties: {
          amount: {
            type: 'number',
            description: 'The amount of ETH to send to the user',
          },
          address: {
            type: 'string',
            description: 'The address of the user to send the ETH to',
          },
        },
        required: ['amount', 'address'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_nft',
      description: 'Send an NFT to the user',
      parameters: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'The address of the user to send the NFT to',
          },
        },
        required: ['address'],
      },
    },
  },
]

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
        take: limit * 2 + 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (chats && chats.length > 0) {
    const now = new Date()
    await Promise.all(
      chats.map(async (chat) => {
        const messageResetTime = new Date(chat.messagesResetTime)
        if (messageResetTime < now) {
          await prisma.chat.updateMany({
            where: { chatId: chat.chatId },
            data: {
              messagesRemaining: chat.totalMessagesAllowed,
              messagesResetTime: now,
            },
          })
        }
      })
    )
  }

  if (chats && chats.length > 0) {
    return chats.map((chat) => ({
      ...chat,
      messages: chat.messages.slice(0, limit * 2).reverse(),
      hasMoreMessages: chat.messages.length > limit * 2,
    }))
  }

  const now = new Date()
  // 12 hours from now
  const messagesResetTime = new Date(now.getTime() + 12 * 60 * 60 * 1000)

  const defaultChats = await Promise.all(
    defaultChatNames.map(async (name) => {
      const chat = await prisma.chat.create({
        data: {
          name,
          userId,
          totalMessagesAllowed: defaultChatTotalMessagesAllowed,
          messagesRemaining: defaultChatTotalMessagesAllowed,
          messagesResetTime,
          status: 'active',
        },
      })

      return chat
    })
  )

  const withMessages = await Promise.all(
    defaultChats.map(async (chat) => {
      let messages: Message[] = []
      if (chat.name === 'duin' || chat.name === 'scorekeeper') {
        const newMessage = await prisma.message.create({
          data: {
            content: defaultMessage[chat.name],
            role: 'assistant',
            chatId: chat.chatId,
          },
        })
        messages = [newMessage]
      }
      return {
        ...chat,
        messages: messages,
        hasMoreMessages: messages.length > defaultChatTotalMessagesAllowed,
      }
    })
  )

  return withMessages
}

export const deleteChats = async (userId: string) => {
  await prisma.chat.deleteMany({
    where: {
      userId,
    },
  })
}

export const addUserMessage = async (
  chatId: string,
  message: string,
  address: string
) => {
  const chat = await prisma.chat.findUnique({
    where: { chatId },
  })

  if (!chat) {
    throw createError(404, 'Chat not found')
  }

  if (chat.messagesRemaining <= 0) {
    throw createError(400, 'Chat has no remaining messages')
  }

  const userMessage = await prisma.message.create({
    data: {
      content: message,
      role: 'user',
      chatId,
    },
  })

  await prisma.chat.update({
    where: { chatId },
    data: { messagesRemaining: { decrement: 1 } },
  })

  const userDir = 'duin'
  const outputPrefix = `${userDir}-${userMessage.messageId}`

  let responseMessageContent = ''
  let attestation = ''
  let tools = ''
  let attestationWithoutTools = ''
  if (chat.name === 'scorekeeper') {
    const { llm_response, attestation_url } = await executeLLM({
      url: 'https://api.openai.com/v1/chat/completions',
      apiKey: OPENAI_API_KEY,
      llmRequest: {
        messages: [
          { role: 'system', content: SCOREKEEPER_SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        model: 'gpt-4o-mini',
        max_tokens: 1000,
      },
      userDir,
      outputPrefix,
    })

    attestation = attestation_url
    responseMessageContent = llm_response?.choices[0]?.message?.content || ''
  }

  if (chat.name === 'duin') {
    const attestationUrls = extractAttestationUrls(message)
    console.log('attestationUrls', attestationUrls)

    const verifiedAttestationData = (
      await Promise.all(
        attestationUrls.map(async (url) => {
          const response = await executeVerifier({ fileKey: url })
          const isSystemPromptInRequest = checkIfSystemPromptInRequest(
            response?.sent,
            SCOREKEEPER_SYSTEM_PROMPT
          )
          if (!isSystemPromptInRequest) {
            return null
          }
          const llmResponse = extractMessageFromRecv(response?.recv)
          return llmResponse
        })
      )
    ).filter((data) => Boolean(data))

    let scorekeeperMessage = '[SCOREKEEPER]: No score generated for this user'
    if (verifiedAttestationData.length > 0) {
      scorekeeperMessage = `[SCOREKEEPER]:\n ${verifiedAttestationData[0]}`
    }

    const { llm_response, attestation_url } = await executeLLM({
      url: 'https://api.openai.com/v1/chat/completions',
      apiKey: OPENAI_API_KEY,
      llmRequest: {
        messages: [
          { role: 'system', content: DUIN_SYSTEM_PROMPT },
          { role: 'system', content: `Users Wallet Address: ${address}` },
          { role: 'user', content: message },
          { role: 'user', content: scorekeeperMessage },
        ],
        model: 'gpt-4o-mini',
        max_tokens: 1000,
      },
      userDir,
      outputPrefix,
    })

    attestation = attestation_url
    responseMessageContent = llm_response?.choices[0]?.message?.content || ''

    const {
      llm_response: llm_response_tools,
      attestation_url: attestation_url_tools,
    } = await executeLLM({
      url: 'https://api.openai.com/v1/chat/completions',
      apiKey: OPENAI_API_KEY,
      llmRequest: {
        messages: [
          { role: 'system', content: DUIN_SYSTEM_PROMPT },
          { role: 'system', content: `Users Wallet Address: ${address}` },
          { role: 'user', content: message },
          { role: 'user', content: scorekeeperMessage },
        ],
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        tools: defaultTools,
      },
      userDir,
      outputPrefix,
    })

    const toolsUsed = llm_response_tools?.choices[0]?.message?.tool_calls
    if (toolsUsed && toolsUsed.length > 0) {
      attestation = attestation_url_tools
      attestationWithoutTools = attestation_url
      tools = JSON.stringify(toolsUsed)
    }
  }

  console.log('responseMessageContent', responseMessageContent)
  console.log('attestation', attestation)

  const responseMessage = await prisma.message.create({
    data: {
      content: responseMessageContent,
      role: 'assistant',
      chatId,
      attestation,
      tools,
      attestationWithoutTools,
    },
  })

  return responseMessage
}

export const getPreviousMessages = async (
  chatId: string,
  beforeTimestamp: Date
) => {
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
    take: limit * 2 + 1,
  })

  return {
    messages: messages.slice(0, limit * 2).reverse(),
    hasMoreMessages: messages.length > limit * 2,
  }
}

export const clearChat = async (chatId: string) => {
  await prisma.message.deleteMany({
    where: { chatId },
  })

  const now = new Date()
  const messagesResetTime = new Date(now.getTime() + 12 * 60 * 60 * 1000)

  const chat = await prisma.chat.findUnique({
    where: { chatId },
  })

  if (!chat) {
    throw createError(404, 'Chat not found')
  }

  await prisma.chat.update({
    where: { chatId },
    data: {
      messagesRemaining: defaultChatTotalMessagesAllowed,
      messagesResetTime,
    },
  })

  console.log('chat.name', chat.name)

  if (chat.name === 'duin' || chat.name === 'scorekeeper') {
    await prisma.message.create({
      data: {
        content: defaultMessage[chat.name],
        role: 'assistant',
        chatId,
      },
    })
  }
}
