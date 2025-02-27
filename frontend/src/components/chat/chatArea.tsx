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
  messagesEndRef,
  messagesContainerRef,
  onClearChatClick,
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
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  messagesContainerRef: React.RefObject<HTMLDivElement | null>
  onClearChatClick: () => void
}) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.target as HTMLDivElement

    // Load more messages when scrolled near the top
    if (scrollTop < 50 && !isLoadingMore && hasMoreMessages) {
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
        disabled={isTyping}
      />
    </div>
  )
} 