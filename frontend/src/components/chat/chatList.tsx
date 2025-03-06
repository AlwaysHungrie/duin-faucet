import { usePrivyAuth } from '@/hooks/usePrivyAuth'
import ChatItem from './chatItem'
import { Chat } from './types'

export default function ChatList({
  chats,
  activeChatId,
  isMobile,
  onChatSelect,
  clearChats,
  handleDeleteUser,
}: {
  chats: Chat[]
  activeChatId: string | null
  isMobile: boolean
  onChatSelect: (chatId: string) => void
  clearChats: () => void
  handleDeleteUser: () => void
}) {
  const activeChat = chats.find((chat) => chat.chatId === activeChatId)
  const { authenticatedUser: user, isLoading, login } = usePrivyAuth()
  const address = user && user.wallet?.address

  return (
    <div
      className={`w-full md:w-1/3 border-r absolute md:relative z-10 bg-white h-full
      ${isMobile && activeChat ? 'translate-x-[-100%]' : 'translate-x-0'}
       transition-transform duration-300 ease-in-out flex flex-col`}
    >
      <div className="flex-1 overflow-y-auto">
        {(isLoading || !address) && (
          <div
            onClick={login}
            className={`flex items-center p-3 border-b cursor-pointer bg-gray-100 hover:bg-gray-200`}
          >
            <div className="flex items-center w-full">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium truncate">
                    {isLoading ? 'Loading...' : 'Wallet not connected'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-600 truncate">
                    {isLoading ? '' : 'Please connect your wallet to continue'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {chats.map((chat) => (
          <ChatItem
            key={chat.chatId}
            chat={chat}
            isActive={activeChat?.chatId === chat.chatId}
            onClick={() => onChatSelect(chat.chatId)}
            handleDeleteUser={handleDeleteUser}
            clearChats={clearChats}
          />
        ))}
      </div>
    </div>
  )
}
