'use client'
import ChatList from '@/components/chat/chatList'
import { Message } from '@/components/chat/types'
import { Chat } from '@/components/chat/types'
import { usePrivyAuth } from '@/hooks/usePrivyAuth'
import { useChatStore } from '@/providers/chat'
import { useCallback, useEffect } from 'react'

export default function ChatHome() {
  const { jwtToken } = usePrivyAuth()
  const { chats, activeChat, setActiveChat, setChats } = useChatStore()

  const getChats = useCallback(async (jwtToken: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    )
    const data = await response.json()
    if (data.success) {
      console.log('chats', data.chats)
      setChats(
        data.chats.map((chat: Chat) => ({
          ...chat,
          messages: chat.messages.map((message: Message) => ({
            ...message,
            timestamp: new Date(message.timestamp),
          })),
          status: 'active',
        })) satisfies Chat[]
      )
    }
  }, [setChats])

  useEffect(() => {
    console.log('jwtToken', jwtToken)
    if (!jwtToken) return
    getChats(jwtToken)
  }, [jwtToken, getChats])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex h-full w-full overflow-hidden">
        <ChatList
          chats={chats}
          activeChatId={activeChat}
          isMobile={false}
          onChatSelect={(chatId: string) => setActiveChat(chatId)}
          clearChats={() => setChats([])}
        />
      </div>
    </div>
  )
}
