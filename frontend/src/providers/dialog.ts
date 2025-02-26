import { create } from 'zustand';
import { ReactNode } from 'react';

interface DialogState {
  isOpen: boolean;
  content: ReactNode | null;
  openDialog: (content: ReactNode) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  content: null,
  openDialog: (content: ReactNode) => set({ isOpen: true, content }),
  closeDialog: () => set({ isOpen: false, content: null }),
}));
