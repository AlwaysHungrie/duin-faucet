export const ChatStatus = ['loading', 'pending', 'active'] as const

export type Chat = {
  chatId: string
  name: string

  totalMessagesAllowed: number
  messagesRemaining: number
  messagesResetTime: Date
  status: (typeof ChatStatus)[number]

  messages: Message[]
}

export type Message = {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}
