import CrystalBall from 'react-crystal-ball'
import { Chat } from './types'
import { MoreVertical } from 'lucide-react'
import { usePrivyAuth } from '@/hooks/usePrivyAuth'
import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { formatAddress } from '@/utils/formatting'
import { useChatStore } from '@/providers/chat'

export const formatChatName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export default function ChatItem({
  chat,
  isActive,
  onClick,
  handleDeleteUser,
  clearChats,
}: {
  chat: Chat
  isActive: boolean
  onClick: () => void
  handleDeleteUser: () => void
  clearChats: () => void
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { setActiveChat } = useChatStore()

  const { authenticatedUser: user, logout, isLoading } = usePrivyAuth()
  const address = user && user.wallet?.address

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    clearChats()
    setActiveChat('')
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
      onClick={onClick}
      className={`flex items-center p-3 border-b cursor-pointer ${
        chat.name === 'self'
          ? 'bg-gray-200 hover:bg-gray-200'
          : isActive
          ? 'bg-gray-100 hover:bg-gray-100'
          : 'hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center w-full">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <span className="font-medium truncate">
              {formatChatName(chat.name)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-600 truncate">
              {chat.name === 'self'
                ? isLoading || !address
                  ? 'Loading...'
                  : `Connected with ${formatAddress(address)}`
                : `(${chat.messagesRemaining} messages remaining for today)`}
            </p>
          </div>
        </div>

        {chat.name === 'self' && (
          <div className="relative" ref={dropdownRef}>
            <div
              className="ml-auto"
              onClick={(e) => {
                e.stopPropagation()
                setDropdownOpen(!dropdownOpen)
              }}
            >
              <MoreVertical className="h-5 w-5" />
            </div>
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
                {address && process.env.NEXT_PUBLIC_DEV_MODE !== 'true' && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleDeleteUser}
                  >
                    Delete User
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {chat.name === 'duin' && (
          <div className="ml-auto rounded-full h-[32px] w-[32px] overflow-hidden">
            <CrystalBall size={34} colorPalette={1} speed={4} />
          </div>
        )}
      </div>
    </div>
  )
}
