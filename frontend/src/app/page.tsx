'use client'

import { CONFIG } from '@/config'
import { usePrivyAuth } from '@/hooks/usePrivyAuth'
import Image from 'next/image'
import Link from 'next/link'
import CrystalBall from 'react-crystal-ball'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useRouter } from 'next/navigation'

const cardClass =
  'mt-auto z-10 w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[825px] relative aspect-video rounded-3xl lg:rounded-[32px] overflow-hidden cursor-pointer hover:rotate-1 hover:scale-105 transition-all duration-300 group'

export default function Home() {
  const router = useRouter()
  const { isLoading, authenticatedUser: user, login, logout } = usePrivyAuth()

  const isMobile = useMediaQuery('(max-width: 640px)')
  const isTablet = useMediaQuery('(max-width: 768px)')
  const isDesktop = useMediaQuery('(max-width: 1024px)')
  const isLarge = useMediaQuery('(max-width: 99999px)')

  const orbSize = isMobile ? 60 : isTablet ? 100 : isDesktop ? 120 : isLarge ? 140 : 0

  const renderCardContent = () => {
    return (
      <>
        <Image src="/heroCard.svg" alt="hero" fill className="object-cover" />
        <div className="h-full w-full bg-gradient-to-b from-transparent to-black/30 absolute top-0 left-0" />
        <div className="absolute bottom-0 left-0 w-full h-full flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[128px] leading-tight sm:leading-tight md:leading-tight lg:leading-[164px] font-semibold text-white">
            {CONFIG.COPY.HOME.TITLE}
          </h1>
          <p className="text-sm sm:text-lg md:text-xl lg:text-[24px] leading-snug sm:leading-snug md:leading-snug lg:leading-[28px] text-white">
            {CONFIG.COPY.HOME.SUBTITLE}
            <br />
            {CONFIG.COPY.HOME.SUBTITLE_2}
          </p>
          <div className="mt-2 sm:mt-4 md:mt-6 p-0.5 bg-white/25 rounded-full opacity-0 animate-fade-in">
            <CrystalBall size={orbSize} colorPalette={1} speed={1.5} />
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="bg-homeBg font-redditSans">
      <div className="flex flex-col items-center h-dvh p-4 overflow-hidden w-screen relative">
        <div className="flex w-full z-10 pt-2">
          <div className="flex items-center gap-2 ml-auto pr-2">
            <Link href={CONFIG.TELEGRAM_URL} target="_blank">
              <Image
                src="/telegram-blue.svg"
                alt="telegram"
                height={32}
                width={32}
                className="opacity-80 hover:opacity-100"
              />
            </Link>
            <Link href={CONFIG.X_URL} target="_blank">
              <Image
                src="/twitter.svg"
                alt="x"
                height={32}
                width={32}
                className="opacity-70 hover:opacity-100"
              />
            </Link>
          </div>
        </div>

        <div
          className={cardClass}
          onClick={() => {
            if (!isLoading && user) {
              router.push('/chat')
              return
            }
            login()
          }}
        >
          {renderCardContent()}
        </div>
        <div className="absolute bottom-[-60px] sm:bottom-[-80px] md:bottom-[-100px] lg:bottom-[-120px] left-0 w-[442px] sm:w-[600px] md:w-[700px] lg:w-[884px] h-[422px] sm:h-[600px] md:h-[700px] lg:h-[845px] animate-spin-slow-mobile md:animate-spin-slow">
          <Image
            src="/landing/artifact1.svg"
            alt="decorative artifact"
            fill
            className="object-contain"
          />
        </div>

        <div className="absolute top-[-60px] sm:top-[-80px] md:top-[-100px] lg:top-[-120px] right-[-270px] sm:right-[-360px] md:right-[-450px] lg:right-[-540px] w-[398px] sm:w-[500px] md:w-[650px] lg:w-[796px] h-[614px] sm:h-[800px] md:h-[1000px] lg:h-[1229px] animate-bounce-slow-mobile md:animate-bounce-slow ">
          <Image
            src="/landing/artifact2.svg"
            alt="decorative artifact"
            fill
            className="object-contain"
          />
        </div>

        {!isLoading && user ? (
          <div className="z-10 text-sm md:text-base mb-auto mt-4 flex gap-2 items-center opacity-40">
            <Link href="/chat" className="cursor-pointer hover:opacity-70">
              Click here to enter
            </Link>
            <span>|</span>
            <div
              className="cursor-pointer hover:opacity-70"
              onClick={() => {
                logout()
              }}
            >
              Disconnect wallet
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              if (isLoading) return
              login()
            }}
            className="z-10 text-sm md:text-base mb-auto mt-4 cursor-pointer opacity-40 hover:opacity-70"
          >
            {isLoading ? 'Loading...' : 'Connect your wallet to enter'}
          </div>
        )}
      </div>
    </div>
  )
}
