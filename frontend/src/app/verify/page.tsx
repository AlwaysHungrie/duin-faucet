'use client'

import { usePrivyAuth } from '@/hooks/usePrivyAuth'
import { Loader, LucideAlertTriangle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

function VerifyPage() {
  const { jwtToken } = usePrivyAuth()
  const searchParams = useSearchParams()
  const attestation = useMemo(
    () => searchParams.get('attestation'),
    [searchParams]
  )

  const [isLoading, setIsLoading] = useState(true)

  const [attestationData, setAttestationData] = useState<{
    server_name: string
    time: string
    verifying_key: string
    recv: string
    sent: string
  }>()

  const [error, setError] = useState<string>()

  const getAttestationData = useCallback(
    async (fileKey: string) => {
      setIsLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/verifier/verify?fileKey=${fileKey}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      const data = response.data
      if (data.success) {
        setAttestationData(data.result)
      } else {
        setError('Failed to verify attestation')
      }
      setIsLoading(false)
    },
    [jwtToken]
  )

  useEffect(() => {
    if (!attestation) {
      return
    }
    if (!jwtToken) {
      return
    }
    if (attestationData) {
      return
    }

    if (attestation.startsWith('https://public-tlsn-notary-test.s3.ap-south-1.amazonaws.com/')) {
      getAttestationData(attestation)
      return
    }

    const keys = attestation.split('/')
    const fileKey = keys[keys.length - 1]
    const bucketKey = keys[keys.length - 2]
    getAttestationData(`${bucketKey}/${fileKey}`)
  }, [attestation, getAttestationData, jwtToken, attestationData])

  const renderIfJson = (json: string) => {
    try {
      const data = JSON.parse(json)
      return (
        <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return json
    }
  }

  const renderSent = (sent: string) => {
    return sent
      .split('\r\n')
      .map((line, index) => <span key={index}>{renderIfJson(line)}</span>)
  }

  const parseIfJson = (str: string) => {
    try {
      return JSON.parse(str)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return null
    }
  }

  const extractMessageFromRecv = (response: string) => {
    const recv = response.substring(
      response.indexOf('{'),
      response.lastIndexOf('}') + 1
    )
    const recvJson = recv
      .split('\r\n')
      .filter((_, i) => {
        return i % 2 === 0
      })
      .join('')
    const jsonResponse = parseIfJson(recvJson)

    if (!jsonResponse) {
      return null
    }

    const choice = jsonResponse.choices[0]

    if (!choice) {
      return null
    }

    const message = choice.message

    if (!message) {
      return null
    }

    return message.content
  }

  const renderRecv = (recv: string) => {
    const message = extractMessageFromRecv(recv)
    const recvHeaders = recv.substring(0, recv.indexOf('{'))
    return (
      <>
        {recvHeaders.split('\n').map((line, index) => (
          <span key={index}>{renderIfJson(line)}</span>
        ))}
        <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">
          {message}
        </pre>
      </>
    )
  }

  const renderAttestationData = () => {
    if (error) return

    return (
      <div className="flex flex-col gap-2 break-words">
        <p className="font-bold text-2xl">Attestation Report: </p>
        <code className="text-sm">{attestation}</code>
        <p>==============================================</p>
        <p>
          Time: <span className="text-sm">{attestationData?.time}</span>
        </p>
        <p>
          Notary Key:{' '}
          <span className="text-sm">{attestationData?.verifying_key}</span>
        </p>
        <p>
          Server Name:{' '}
          <span className="text-sm">{attestationData?.server_name}</span>
        </p>
        <p>==============================================</p>
        <p>Sent Data:</p>
        <br />
        <p>{renderSent(attestationData?.sent || '')}</p>
        <p>==============================================</p>
        <p>Received Data:</p>
        <br />
        <p>{renderRecv(attestationData?.recv || '')}</p>
        <p>==============================================</p>
        <p>Raw Received Data:</p>
        <br />
        <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">
          {attestationData?.recv}
        </pre>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="px-3 py-1 bg-gray-200 rounded-md text-xs flex items-center">
          <Loader className="h-3 w-3 animate-spin mr-2" />
          Verifying...
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="px-3 py-1 bg-gray-200 rounded-md text-xs flex items-center">
          <LucideAlertTriangle className="h-3 w-3 mr-2" />
          {error}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen font-mono">
      <div className="flex flex-col gap-2 break-words p-8">
        {renderAttestationData()}
      </div>
    </div>
  )
}

export default function VerifyPageWrapper() {
  return (
    <Suspense>
      <VerifyPage />
    </Suspense>
  )
}