import {
  LucideCheck,
  LucideDownload,
  LucideScanEye,
  LucideX,
} from 'lucide-react'
import { Message } from './types'
import Link from 'next/link'
import axios from 'axios'
import { usePrivyAuth } from '@/hooks/usePrivyAuth'
import { useCallback, useMemo } from 'react'
import CTAButton from '../ctaButton'

export const formatMessageTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const FunctionCall = ({ name, args }: { name: string; args: string }) => {
  return (
    <div className="flex flex-col gap-2 mb-4 px-4 pb-4 pt-2 bg-gray-100 rounded-lg self-center">
      <p className="font-bold">{name}</p>
      <p className="text-sm bg-white rounded-sm p-2 overflow-x-auto whitespace-nowrap .no-scrollbars">
        {args}
      </p>
      <CTAButton
        onClick={() => {
          console.log('Call Function')
        }}
        className="mt-2"
      >
        Execute With Constella
      </CTAButton>
    </div>
  )
}

export default function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const { jwtToken } = usePrivyAuth()

  const tools = useMemo(() => {
    if (message.tools) {
      const tools = JSON.parse(message.tools)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedTools = tools.map(({ function: tool }: { function: any }) => {
        const args = JSON.parse(tool.arguments)
        const argsString = Object.entries(args)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
        return {
          name: tool.name,
          args: argsString,
        }
      })
      console.log('parsedTools', parsedTools)
      return parsedTools
    }
    return []
  }, [message.tools])

  const handleDownload = useCallback(async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/verifier/download?attestation=${message.attestation}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    )
    if (response.data.success) {
      window.open(response.data.url, '_blank')
    } else {
      console.error('Failed to download attestation')
    }
  }, [jwtToken, message.attestation])

  return (
    <div className={`flex mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] px-2 sm:px-3 py-1 sm:py-2 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {tools.length > 0 && (
          <div className="text-xs mt-4">
            <div className="font-bold mb-1">Agent decided to call:</div>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {tools.map((tool: any, index: number) => (
              <FunctionCall key={index} name={tool.name} args={tool.args} />
            ))}
          </div>
        )}

        <div
          className={`text-xs mt-1 flex items-center ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className={`${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {formatMessageTimestamp(message.timestamp)}
          </span>
          {message.attestation ? (
            <>
              <div
                title="This message has been verified to be generated by an Agent"
                className="cursor-pointer"
              >
                <LucideCheck className="w-4 h-4 ml-1" />
              </div>

              <Link
                href={`/verify?attestation=${message.attestation}`}
                target="_blank"
                title="Inspect"
              >
                <LucideScanEye className="w-4 h-4 ml-1" />
              </Link>

              <div
                onClick={handleDownload}
                title="Download"
                className="cursor-pointer"
              >
                <LucideDownload className="w-4 h-4 ml-1" />
              </div>
            </>
          ) : (
            <>
              <div title="Cannot verify this message was generated by an Agent">
                <LucideX className="w-4 h-4 ml-1" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
