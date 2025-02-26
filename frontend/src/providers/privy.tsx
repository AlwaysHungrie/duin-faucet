'use client'

import { type ReactNode } from 'react'
import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth'
import { CONFIG } from '@/config'

interface PrivyProviderProps {
  children: ReactNode
}

export default function PrivyProvider({ children }: PrivyProviderProps) {
  return (
    <BasePrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_API_ID!}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#FA3B6A',
          logo: '/squareLogo.svg',
        },
        walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
        supportedChains: CONFIG.SUPPORTED_CHAINS,
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  )
}
