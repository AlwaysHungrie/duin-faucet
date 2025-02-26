import { create } from 'zustand'
import { Chat, Message } from '@/components/chat/types'

interface ChatState {
  chats: Chat[]
  setChats: (chats: Chat[]) => void
  activeChat: string | null
  setActiveChat: (chatId: string) => void
  handleResponseMessage: (chatId: string, message: Message, responseToMessageId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChat: null,
  setActiveChat: (chatId: string) => {
    set({ activeChat: chatId })
    localStorage.setItem('activeChat', chatId)
  },
  setChats: (chats: Chat[]) => set({ chats }),
  handleResponseMessage: (
    chatId: string,
    message: Message,
    responseToMessageId: string
  ) => {
    set((state) => {
      // Find the chat that needs to be updated
      const updatedChats = state.chats.map((chat) => {
        if (chat.chatId !== chatId) return chat
        
        // Find the index of the message being responded to
        const messageIndex = chat.messages.findIndex(
          (msg) => msg.id === responseToMessageId
        )
        
        // If the message isn't found, add the new message at the end
        if (messageIndex === -1) {
          return {
            ...chat,
            messages: [...chat.messages, message],
            updatedAt: new Date().toISOString()
          }
        }
        
        // Insert the new message after the one being responded to
        const updatedMessages = [
          ...chat.messages.slice(0, messageIndex + 1),
          message,
          ...chat.messages.slice(messageIndex + 1)
        ]
        
        return {
          ...chat,
          messages: updatedMessages,
          updatedAt: new Date().toISOString()
        }
      })
      
      return { chats: updatedChats }
    })
  }
}))