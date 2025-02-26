import { Message } from './types'

export default function MessageItem({
  message,
  isGroup,
  previousMessage,
}: {
  message: Message
  isGroup: boolean
  previousMessage: Message | null
}) {
  const isUser = message.role === 'user'
  const showAvatar =
    !isUser && (!previousMessage || previousMessage.role !== message.role)

  return (
    <div className={`flex mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] px-2 sm:px-3 py-1 sm:py-2 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        {!isUser && isGroup && showAvatar && (
          <div className="text-xs font-medium text-blue-600 mb-1">
            {message.role}
          </div>
        )}

        <p className="whitespace-pre-wrap break-words">{message.content}</p>

        <div
          className={`text-xs mt-1 flex items-center ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className={`${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp}
          </span>
        </div>
      </div>
    </div>
  )
}
