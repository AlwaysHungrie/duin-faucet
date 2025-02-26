import { create } from 'zustand';
import { Chat } from '@/components/chat/types';

interface ChatState {
  chats: Chat[]
  setChats: (chats: Chat[]) => void
  activeChat: string | null
  setActiveChat: (chatId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChat: null,
  setActiveChat: (chatId: string) => set({ activeChat: chatId }),
  setChats: (chats: Chat[]) => set({ chats }),
}));
