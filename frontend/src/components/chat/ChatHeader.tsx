import { Button } from '@/components/ui/button'
import { Phone, Video, Search, MoreVertical, ArrowLeft } from 'lucide-react'
import { Chat } from './types'

export default function ChatHeader({
  chat,
  onBackClick,
}: {
  chat: Chat
  onBackClick: () => void
}) {
  return (
    <div className="bg-gray-50 p-3 flex items-center justify-between border-b sticky top-0 z-10">
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
          <h2 className="font-medium">{chat.name}</h2>
        </div>
      </div>

      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden xs:flex">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
