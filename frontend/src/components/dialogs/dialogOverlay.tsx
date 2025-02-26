'use client'

import React from 'react'
import { useDialogStore } from '@/providers/dialog'
import DialogBase from './dialogBase'

export const DialogOverlay: React.FC = () => {
  const { isOpen, content, closeDialog } = useDialogStore()

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[3px] transition-opacity duration-200 animate-in fade-in"
      onClick={closeDialog}
    >
      <DialogBase>
        {content}
      </DialogBase>
    </div>
  )
}
