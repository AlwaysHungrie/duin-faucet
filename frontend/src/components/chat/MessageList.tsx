import MessageItem from './MessageItem'
import { Loader } from 'lucide-react'
import { Message } from './types'

export default function MessageList({
  messages,
  isGroup,
  isTyping,
  isLoadingMore,
  hasMoreMessages,
  messagesEndRef,
  messagesContainerRef,
  onScroll,
}: {
  messages: Message[]
  isGroup: boolean
  isTyping: boolean
  isLoadingMore: boolean
  hasMoreMessages: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  messagesContainerRef: React.RefObject<HTMLDivElement | null>
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void
}) {
  return (
    <div
      className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-50"
      style={{
        backgroundImage:
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2YxZjVmOSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iMSIgZmlsbD0iI2U1ZTdlYiI+PC9jaXJjbGU+CjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEiIGZpbGw9IiNlNWU3ZWIiPjwvY2lyY2xlPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZTVlN2ViIj48L2NpcmNsZT4KPGNpcmNsZSBjeD0iMTAiIGN5PSIwIiByPSIxIiBmaWxsPSIjZTVlN2ViIj48L2NpcmNsZT4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iI2U1ZTdlYiI+PC9jaXJjbGU+CjxjaXJjbGUgY3g9IjAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iI2U1ZTdlYiI+PC9jaXJjbGU+CjxjaXJjbGUgY3g9IjEwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNlNWU3ZWIiPjwvY2lyY2xlPgo8Y2lyY2xlIGN4PSIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNlNWU3ZWIiPjwvY2lyY2xlPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjAiIHI9IjEiIGZpbGw9IiNlNWU3ZWIiPjwvY2lyY2xlPgo8L3N2Zz4=')",
        backgroundRepeat: 'repeat',
        backgroundSize: '40px 40px',
      }}
      ref={messagesContainerRef}
      onScroll={onScroll}
    >
      {isLoadingMore && (
        <div className="flex justify-center mb-4">
          <span className="px-3 py-1 bg-gray-200 rounded-md text-xs flex items-center">
            <Loader className="h-3 w-3 animate-spin mr-2" />
            Loading previous messages...
          </span>
        </div>
      )}

      {!isLoadingMore && hasMoreMessages && (
        <div className="flex justify-center mb-4">
          <span className="text-xs text-gray-500">
            Scroll up to load more messages
          </span>
        </div>
      )}

      {!hasMoreMessages && (
        <div className="flex justify-center mb-4">
          <span className="text-xs text-gray-500">
            Beginning of conversation
          </span>
        </div>
      )}

      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          message={message}
          isGroup={isGroup}
          previousMessage={index > 0 ? messages[index - 1] : null}
        />
      ))}

      {isTyping && (
        <div className="flex justify-start mb-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
