'use client'
import ChatArea from '@/components/chat/chatArea'
import ChatList from '@/components/chat/chatList'
import { Message } from '@/components/chat/types'
import { Chat } from '@/components/chat/types'
import ChatLandingScreen from '@/components/ChatLandingScreen'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePrivyAuth } from '@/hooks/usePrivyAuth'
import { useChatStore } from '@/providers/chat'
import axios from 'axios'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export default function ChatHome() {
  const { jwtToken } = usePrivyAuth()
  const {
    chats,
    activeChat,
    setActiveChat,
    setChats,
    handleResponseMessage,
    handleAddPreviousMessages,
  } = useChatStore()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [isTyping, setIsTyping] = useState(false)
  const [inputMessage, setInputMessage] = useState('')

  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const ref = useRef<{
    messagesEnd: HTMLDivElement | null
    messagesContainer: HTMLDivElement | null
    isLoadingMore: boolean
  }>({
    messagesEnd: null,
    messagesContainer: null,
    isLoadingMore: false,
  })

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
            hasMoreMessages: chat.hasMoreMessages,
            isLoadingMore: false,
          })) satisfies Chat[]
        )
        // if (!isMobile) {
        //   setActiveChat(localStorage.getItem('activeChat') || '')
        // }
      }
    },
    [setChats]
  )

  useEffect(() => {
    console.log('jwtToken', jwtToken)
    if (!jwtToken) return
    getChats(jwtToken)
  }, [jwtToken, getChats])

  const scrollToBottom = useCallback(() => {
    ref.current.messagesEnd?.scrollIntoView({
      behavior: ref.current.isLoadingMore ? 'instant' : 'smooth',
    })
  }, [])

  // Modified: Only scroll to bottom when new messages are added (not when loading previous ones)
  useEffect(() => {
    if (currentChat && !ref.current.isLoadingMore) {
      scrollToBottom()
    } else {
      setTimeout(() => {
        ref.current.isLoadingMore = false
        setIsLoadingMore(false)
      }, 100)
    }
  }, [currentChat?.messages?.length, scrollToBottom, currentChat])

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!activeChat) return
      setInputMessage('')
      setIsTyping(true)

      const newMessage: Message = {
        messageId: crypto.randomUUID(),
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

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/message`,
        {
          chatId: activeChat,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )

      const data = response.data
      if (data.success) {
        const responseMessage = data.responseMessage
        handleResponseMessage(activeChat, responseMessage, newMessage.messageId)
        setIsTyping(false)
        return
      }
      setIsTyping(false)
    },
    [activeChat, chats, setChats, handleResponseMessage, jwtToken]
  )

  const handleLoadMoreMessages = useCallback(async () => {
    if (currentChat?.isLoadingMore) return
    if (!currentChat?.hasMoreMessages) return
    const activeChat = currentChat?.chatId

    // Set loading state for previous messages
    // currentChat.isLoadingMore = true
    ref.current.isLoadingMore = true
    setIsLoadingMore(true)

    // Store the current scroll height before loading new messages
    const chatContainer = ref.current.messagesEnd?.parentElement
    const scrollHeightBefore = chatContainer?.scrollHeight || 0
    const scrollPosition = chatContainer?.scrollTop || 0

    const firstMessageTime = currentChat?.messages[0].timestamp
    const timestampToLoad = new Date(firstMessageTime).toISOString()

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/${activeChat}?beforeTimestamp=${timestampToLoad}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    )

    const { messages, hasMoreMessages: hasMoreMessagesFromBackend } =
      response.data

    const pastMessages: Message[] = messages.map((message: Message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }))

    await new Promise((resolve) => setTimeout(resolve, 1000))

    handleAddPreviousMessages(
      activeChat,
      pastMessages,
      hasMoreMessagesFromBackend
    )

    setTimeout(() => {
      if (chatContainer) {
        const newScrollHeight = chatContainer.scrollHeight
        const heightDifference = newScrollHeight - scrollHeightBefore
        chatContainer.scrollTop = scrollPosition + heightDifference
      }
    }, 0)
  }, [jwtToken, currentChat, handleAddPreviousMessages])

  const handleClearChat = useCallback(async () => {
    if (!currentChat) return
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/${currentChat.chatId}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    )
    setChats(
      chats.map((chat: Chat) => {
        if (chat.chatId === currentChat.chatId) {
          return {
            ...chat,
            messages: [],
            messagesRemaining: 10,
            messagesResetTime: new Date(),
          }
        }
        return chat
      })
    )
    setActiveChat('')
    localStorage.removeItem('activeChat')
  }, [currentChat, chats, setChats, setActiveChat, jwtToken])

  const handleDeleteUser = useCallback(async () => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    )
    setChats([])
    setActiveChat('')
    localStorage.removeItem('activeChat')
    setInputMessage('')
  }, [jwtToken, setChats, setActiveChat, setInputMessage])

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
          handleDeleteUser={handleDeleteUser}
        />

        {!activeChat && <ChatLandingScreen isMobile={isMobile} />}

        {currentChat && (
          <ChatArea
            chat={currentChat}
            isMobile={isMobile}
            isTyping={isTyping}
            hasMoreMessages={currentChat.hasMoreMessages}
            onBackClick={() => {
              setActiveChat('')
              localStorage.removeItem('activeChat')
              setInputMessage('')
            }}
            onSendMessage={handleSendMessage}
            onLoadMoreMessages={handleLoadMoreMessages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            ref={ref}
            onClearChatClick={handleClearChat}
            isLoadingMore={isLoadingMore}
          />
        )}
      </div>
    </div>
  )
}
