import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'
import ChatItem from './chatItem'
import { Chat } from './types'
import { usePrivyAuth } from '@/hooks/usePrivyAuth'
import { formatAddress } from '@/utils/formatting'
import Avatar from '../avatar'
import { useState, useRef, useEffect } from 'react'

export default function ChatList({
  chats,
  activeChatId,
  isMobile,
  onChatSelect,
  clearChats,
}: {
  chats: Chat[]
  activeChatId: string | null
  isMobile: boolean
  onChatSelect: (chatId: string) => void
  clearChats: () => void
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const activeChat = chats.find((chat) => chat.chatId === activeChatId)
  const { authenticatedUser: user, logout, isLoading, login } = usePrivyAuth()
  const address = user && user.wallet?.address

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    clearChats()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      className={`w-full md:w-1/3 border-r absolute md:relative z-10 bg-white h-full
      ${isMobile && activeChat ? 'translate-x-[-100%]' : 'translate-x-0'}
       transition-transform duration-300 ease-in-out flex flex-col`}
    >
      <div className="bg-homeBg p-3 flex items-center justify-between">
        <h1 className="text-lg font-medium flex items-center gap-2">
          {isLoading ? (
            <span className="text-gray-500">loading...</span>
          ) : address ? (
            <>
              <Avatar address={address} height={24} width={24} />
              {formatAddress(address)}
            </>
          ) : (
            <button onClick={login}>Connect wallet</button>
          )}
        </h1>
        <div className="relative" ref={dropdownRef}>
          <Button 
            variant="ghost" 
            size="icon" 
            className='h-6 w-6'
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-20 border">
              {address && (
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <ChatItem
            key={chat.chatId}
            chat={chat}
            isActive={activeChat?.chatId === chat.chatId}
            onClick={() => onChatSelect(chat.chatId)}
          />
        ))}
      </div>
    </div>
  )
}