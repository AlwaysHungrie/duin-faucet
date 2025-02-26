'use client'
import ChatArea from '@/components/chat/chatArea'
import ChatList from '@/components/chat/chatList'
import { Message } from '@/components/chat/types'
import { Chat } from '@/components/chat/types'
import ChatLandingScreen from '@/components/ChatLandingScreen'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePrivyAuth } from '@/hooks/usePrivyAuth'
import { useChatStore } from '@/providers/chat'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export default function ChatHome() {
  const { jwtToken } = usePrivyAuth()
  const { chats, activeChat, setActiveChat, setChats, handleResponseMessage } = useChatStore()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [isTyping, setIsTyping] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentChat = useMemo(() => {
    return chats.find((chat: Chat) => chat.chatId === activeChat)
  }, [chats, activeChat])

  const getChats = useCallback(
    async (jwtToken: string) => {
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
        setActiveChat(localStorage.getItem('activeChat') || '')
      }
    },
    [setChats, setActiveChat]
  )

  useEffect(() => {
    console.log('jwtToken', jwtToken)
    if (!jwtToken) return
    getChats(jwtToken)
  }, [jwtToken, getChats])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (currentChat) {
      scrollToBottom()
    }
  }, [currentChat?.messages?.length, scrollToBottom, currentChat])

  const handleSendMessage = useCallback(async (message: string) => {
    if (!activeChat) return
    setInputMessage('')
    setIsTyping(true)

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: message,
      role: 'user',
      timestamp: new Date().toISOString(),
    }

    const updatedChats = chats.map((chat: Chat) => {
      if (chat.chatId === activeChat) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        }
      }
      return chat
    })

    setChats(updatedChats)

    const responseMessage: Message = {
      id: crypto.randomUUID(),
      content: 'This is a response message',
      role: 'assistant',
      timestamp: new Date().toISOString(),
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))

    handleResponseMessage(activeChat, responseMessage, newMessage.id)
    setIsTyping(false)
  }, [activeChat, chats, setChats, handleResponseMessage])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex h-full w-full overflow-hidden">
        <ChatList
          chats={chats}
          activeChatId={activeChat}
          isMobile={isMobile}
          onChatSelect={(chatId: string) => {
            setActiveChat(chatId)
            localStorage.setItem('activeChat', chatId)
            setInputMessage('')
          }}
          clearChats={() => setChats([])}
        />

        {!activeChat && <ChatLandingScreen isMobile={isMobile} />}

        {currentChat && (
          <ChatArea
            chat={currentChat}
            isMobile={isMobile}
            isTyping={isTyping}
            isLoadingMore={false}
            hasMoreMessages={false}
            onBackClick={() => {
              setActiveChat('')
              localStorage.removeItem('activeChat')
              setInputMessage('')
            }}
            onSendMessage={handleSendMessage}
            onLoadMoreMessages={() => {}}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
          />
        )}
      </div>
    </div>
  )
}
