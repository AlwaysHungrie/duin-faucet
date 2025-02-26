'use client'
import ChatArea from '@/components/chat/chatArea'
import ChatList from '@/components/chat/chatList'
import { Message } from '@/components/chat/types'
import { Chat } from '@/components/chat/types'
import ChatLandingScreen from '@/components/ChatLandingScreen'
import { usePrivyAuth } from '@/hooks/usePrivyAuth'
import { useChatStore } from '@/providers/chat'
import { useCallback, useEffect, useMemo } from 'react'

export default function ChatHome() {
  const { jwtToken } = usePrivyAuth()
  const { chats, activeChat, setActiveChat, setChats } = useChatStore()

  const currentChat = useMemo(() => {
    return chats.find((chat: Chat) => chat.chatId === activeChat)
  }, [chats, activeChat])

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

        {!activeChat && <ChatLandingScreen isMobile={false} />}

        {currentChat && (
          <ChatArea
            chat={currentChat}
            isMobile={false}
            isTyping={false}
            isLoadingMore={false}
            hasMoreMessages={false}
            onBackClick={() => setActiveChat('')}
            onSendMessage={() => {}}
            onLoadMoreMessages={() => {}}
            inputMessage={''}
            setInputMessage={() => {}}
          />
        )}
      </div>
    </div>
  )
}
