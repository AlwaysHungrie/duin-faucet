import { useRef, useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { Chat } from './types'

export default function ChatArea({
  chat,
  isMobile,
  isTyping,
  isLoadingMore,
  hasMoreMessages,
  onBackClick,
  onSendMessage,
  onLoadMoreMessages,
  inputMessage,
  setInputMessage,
}: {
  chat: Chat
  isMobile: boolean
  isTyping: boolean
  isLoadingMore: boolean
  hasMoreMessages: boolean
  onBackClick: () => void
  onSendMessage: (message: string) => void
  onLoadMoreMessages: () => void
  inputMessage: string
  setInputMessage: (message: string) => void
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom()
  }, [chat.messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.target as HTMLDivElement

    // Load more messages when scrolled near the top
    if (scrollTop < 50 && !isLoadingMore && hasMoreMessages) {
      onLoadMoreMessages()
    }
  }

  const handleSubmit = () => {
    // e.preventDefault()
    onSendMessage(inputMessage)
  }

  return (
    <div
      className={`w-full md:w-2/3 flex flex-col absolute md:relative inset-0 z-0
      ${isMobile && !chat ? 'translate-x-[100%]' : 'translate-x-0'} 
      transition-transform duration-300 ease-in-out`}
    >
      <ChatHeader chat={chat} onBackClick={onBackClick} />

      <MessageList
        messages={chat.messages}
        isGroup={false}
        isTyping={isTyping}
        isLoadingMore={isLoadingMore}
        hasMoreMessages={hasMoreMessages}
        messagesEndRef={messagesEndRef}
        messagesContainerRef={messagesContainerRef}
        onScroll={handleScroll}
      />

      <ChatInput
        value={inputMessage}
        onChange={setInputMessage}
        onSubmit={handleSubmit}
      />
    </div>
  )
} 