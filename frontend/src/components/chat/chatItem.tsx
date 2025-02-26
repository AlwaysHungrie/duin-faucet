import CrystalBall from 'react-crystal-ball'
import { Chat } from './types'

const formatChatName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export default function ChatItem({
  chat,
  isActive,
  onClick,
}: {
  chat: Chat
  isActive: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-100 ${
        isActive ? 'bg-gray-100' : ''
      }`}
    >
      <div className="flex items-center w-full">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <span className="font-medium truncate">{formatChatName(chat.name)}</span>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-600 truncate">
              ({chat.messagesRemaining} messages remaining for today)
            </p>
          </div>
        </div>

        {chat.name === 'duin' && (
          <div className="ml-auto rounded-full h-[32px] w-[32px] overflow-hidden">
            <CrystalBall size={34} colorPalette={1} speed={4} />
          </div>
        )}
      </div>
    </div>
  )
}
