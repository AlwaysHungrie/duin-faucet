import { forwardRef } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { Chat } from './types'

const ChatArea = forwardRef<
  {
    messagesEnd: HTMLDivElement | null
    messagesContainer: HTMLDivElement | null
    isLoadingMore: boolean
  },
  {
    chat: Chat
    isMobile: boolean
    isTyping: boolean
    hasMoreMessages: boolean
    onBackClick: () => void
    onSendMessage: (message: string) => void
    onLoadMoreMessages: () => void
    inputMessage: string
    setInputMessage: (message: string) => void
    onClearChatClick: () => void
    isLoadingMore: boolean
  }
>(function ChatArea(
  {
    chat,
    isMobile,
    isTyping,
    hasMoreMessages,
    onBackClick,
    onSendMessage,
    onLoadMoreMessages,
    inputMessage,
    setInputMessage,
    onClearChatClick,
    isLoadingMore,
  },
  ref
) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!ref || typeof ref !== 'object') return
    const { scrollTop } = e.target as HTMLDivElement

    console.log('isLoadingMore', ref?.current?.isLoadingMore)

    // Load more messages when scrolled near the top
    if (scrollTop < 10 && !ref.current?.isLoadingMore && hasMoreMessages) {
      onLoadMoreMessages()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSendMessage(inputMessage)
  }

  return (
    <div
      className={`w-full md:w-2/3 flex flex-col absolute md:relative inset-0 z-0
      ${isMobile && !chat ? 'translate-x-[100%]' : 'translate-x-0'} 
      transition-transform duration-300 ease-in-out`}
    >
      <ChatHeader
        chat={chat}
        onBackClick={onBackClick}
        onClearChatClick={onClearChatClick}
      />

      <MessageList
        messages={chat.messages}
        isTyping={isTyping}
        hasMoreMessages={hasMoreMessages}
        ref={ref}
        onScroll={handleScroll}
        isLoadingMore={isLoadingMore}
      />

      <ChatInput
        value={inputMessage}
        onChange={setInputMessage}
        onSubmit={handleSubmit}
        disabled={isTyping || chat.messagesRemaining <= 0}
      />
    </div>
  )
}) 

ChatArea.displayName = 'ChatArea'

export default ChatArea