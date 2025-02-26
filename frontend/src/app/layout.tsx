import type { Metadata } from 'next'
import { Reddit_Sans } from 'next/font/google'
import './globals.css'
import Providers from '@/providers/provider'
import { DialogOverlay } from '@/components/dialogs/dialogOverlay'

const redditSans = Reddit_Sans({
  variable: '--font-reddit-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'duin.fun',
  description: 'bet on yourself, get set duin.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${redditSans.variable} antialiased`}>
        <Providers>
          {children}
          <DialogOverlay />
        </Providers>
      </body>
    </html>
  )
}
