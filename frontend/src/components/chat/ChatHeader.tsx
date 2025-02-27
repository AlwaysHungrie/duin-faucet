import { Button } from '@/components/ui/button'
import { ArrowLeft, LucideInfo, LucideTrash } from 'lucide-react'
import { Chat } from './types'
import { formatChatName } from './chatItem'

export default function ChatHeader({
  chat,
  onBackClick,
  onClearChatClick,
}: {
  chat: Chat
  onBackClick: () => void
  onClearChatClick: () => void
}) {
  return (
    <div className="bg-gray-50 p-3 flex items-center border-b sticky top-0 z-10">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackClick}
          className="mr-1 md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h2 className="font-medium">{formatChatName(chat.name)}</h2>
        </div>
      </div>

      <div className="text-sm text-gray-500 ml-auto">
        {chat.messagesRemaining} / {chat.totalMessagesAllowed}
      </div>

      <LucideInfo className="h-5 w-5 text-gray-400 ml-2" />

      <Button variant="ghost" size="icon" onClick={onClearChatClick}>
        <LucideTrash className="h-5 w-5 text-gray-400" />
      </Button>
    </div>
  )
}
