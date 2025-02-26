'use client'

import { PrivyAuthProvider } from '@/hooks/usePrivyAuth'
import PrivyProvider from '@/providers/privy'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider>
      <PrivyAuthProvider>{children}</PrivyAuthProvider>
    </PrivyProvider>
  )
}
