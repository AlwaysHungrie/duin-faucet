import { useMemo } from 'react'
import { Message } from './types'

export default function NftMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const nftData = useMemo(() => {
    const data = JSON.parse(message.content)
    return data
  }, [message])

  const dataString = useMemo(() => {
    if (!nftData) {
      return ''
    }
    let dataString = ''
    if (nftData.name) {
      dataString += `Name: ${nftData.name}\n`
    }
    if (nftData.description) {
      dataString += `Description: ${nftData.description}\n`
    }

    if (nftData.attributes && nftData.attributes.length > 0) {
      nftData.attributes.forEach((attribute: { trait_type: string; value: string }) => {
        if (attribute.trait_type === 'Idea') {
          dataString += `Idea: ${attribute.value}\n`
        }
      })
    }

    return dataString
  }, [nftData])

  if (!nftData) {
    return null
  }
  return (
    <div className={`flex mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] px-2 sm:px-3 py-1 sm:py-2 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={nftData.image}
          alt={nftData.name}
          width={200}
          height={200}
          className="rounded-lg bg-gray-200 mx-auto"
        />
        <p className="whitespace-pre-wrap break-words">{dataString}</p>
      </div>
    </div>
  )
}
