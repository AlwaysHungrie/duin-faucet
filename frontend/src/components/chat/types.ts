export const ChatStatus = ['loading', 'pending', 'active'] as const

export type Chat = {
  chatId: string
  name: string

  totalMessagesAllowed: number
  messagesRemaining: number
  messagesResetTime: Date
  status: (typeof ChatStatus)[number]

  messages: Message[]
  
  isLoadingMore: boolean
  hasMoreMessages: boolean
}

export type Message = {
  messageId: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  attestation?: string
  tools?: string
  attestationHash?: string
}
