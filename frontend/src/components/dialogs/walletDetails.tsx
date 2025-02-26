// TransactionInput.tsx
import { HiX } from 'react-icons/hi'

interface TransactionInputProps {
  label: string
  value: string
  placeholder: string
  hash?: string
  onValueChange: (value: string) => void
  onSubmit: () => void
  onClear?: () => void
  buttonText: string
  allowSubmit: boolean
  type: 'text' | 'number'
}

const TransactionInput = ({
  value,
  placeholder,
  hash,
  onValueChange,
  onSubmit,
  onClear,
  buttonText,
  allowSubmit,
  type,
}: TransactionInputProps) => {
  if (hash) {
    return (
      <div className="flex gap-1 items-center">
        <div className="text-xl font-bold overflow-hidden text-ellipsis w-full">
          {hash}
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(hash)}
          className="text-sm hover:bg-black hover:text-white rounded-lg px-2 py-1"
        >
          Copy
        </button>
        <HiX
          className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600"
          onClick={onClear}
        />
      </div>
    )
  }

  return (
    <div className="flex gap-1 items-center">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg focus:outline-none p-2 bg-gray-200"
      />
      <button
        onClick={onSubmit}
        disabled={!allowSubmit}
        className="w-[55px] text-sm hover:bg-black border border-gray-300 hover:text-white rounded-lg px-1 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {buttonText}
      </button>
    </div>
  )
}

// NetworkStatus.tsx
interface NetworkStatusProps {
  chainName: string
  isChainValid: boolean
  onSwitchNetwork: () => void
  isSwitching: boolean
}

const NetworkStatus = ({
  chainName,
  isChainValid,
  onSwitchNetwork,
  isSwitching,
}: NetworkStatusProps) => {
  if (!isChainValid) {
    return (
      <div
        className="mt-2 md:mt-8 text-sm text-gray-400"
        onClick={onSwitchNetwork}
      >
        <span className="font-bold">Switch Network</span>
      </div>
    )
  }

  return (
    <>
      <div className="mt-2 md:mt-8 text-sm text-gray-400">
        Connected to&nbsp;
        <span className="font-bold">{chainName}</span>
      </div>
      <span
        className="text-xs text-gray-400 cursor-pointer"
        onClick={onSwitchNetwork}
      >
        {isSwitching ? '...' : '(Switch)'}
      </span>
    </>
  )
}

// WalletDetails.tsx
import { formatAddress, formatWeiBalance } from '@/utils/formatting'
import { HiCheck, HiCog, HiDuplicate } from 'react-icons/hi'
import { useCallback, useEffect, useState } from 'react'
import { ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { useDialogStore } from '@/providers/dialog'
import { useRouter } from 'next/navigation'
import { CONFIG } from '@/config'
// import Avatar from '../avatar'

export default function WalletDetails() {
  const router = useRouter()
  const { logout, exportWallet, signMessage } = usePrivy()
  const { wallets } = useWallets()
  const { closeDialog } = useDialogStore()
  const activeWallet = wallets[0]

  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [balanceInWei, setBalanceInWei] = useState<bigint>()
  const [message, setMessage] = useState<string>('')
  const [signature, setSignature] = useState<string>()
  const [amount, setAmount] = useState<string>('')
  const [transactionHash, setTransactionHash] = useState<string>()
  const [isSwitching, setIsSwitching] = useState(false)

  const allowSignMessage = message && message.length === 44
  const allowSendTokens = amount && amount.length > 0

  const address = activeWallet?.address
  const network = activeWallet?.chainId
  const isPrivyManaged = activeWallet?.walletClientType === 'privy'
  const isChainValid = network in CONFIG.VALID_CHAINS_LABELS
  const chainName = isChainValid
    ? CONFIG.VALID_CHAINS_LABELS[
        network as keyof typeof CONFIG.VALID_CHAINS_LABELS
      ]
    : 'Unknown'

  const getBalance = useCallback(async (wallet: ConnectedWallet) => {
    const provider = await wallet.getEthereumProvider()
    const ethersProvider = new ethers.BrowserProvider(provider)
    const balanceInWei = await ethersProvider.getBalance(wallet?.address)
    setBalanceInWei(balanceInWei)
  }, [])

  useEffect(() => {
    if (activeWallet) {
      getBalance(activeWallet)
    }
  }, [activeWallet, getBalance])

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address)
    setShowCopySuccess(true)
    setTimeout(() => setShowCopySuccess(false), 2000)
  }

  const onSwitchNetwork = async () => {
    if (isSwitching) return
    setIsSwitching(true)

    const chainId = network.split(':')[1]
    const currentIndex = CONFIG.SUPPORTED_CHAINS.findIndex(
      (chain) => chain.id.toString() === chainId
    )
    const nextIndex = (currentIndex + 1) % CONFIG.SUPPORTED_CHAINS.length
    await activeWallet?.switchChain(CONFIG.SUPPORTED_CHAINS[nextIndex].id)
    setIsSwitching(false)
  }

  const handleSignMessage = async () => {
    if (!message || !activeWallet) return

    if (isPrivyManaged) {
      const { signature } = await signMessage({ message })
      setSignature(signature)
      return
    }

    const provider = await activeWallet.getEthereumProvider()
    const signature = await provider.request({
      method: 'personal_sign',
      params: [message, address],
    })
    setSignature(signature)
  }

  const handleSendTokens = async () => {
    try {
      if (!amount) return

      const parsedAmount = ethers.parseEther(amount)

      const formattedAddress = ethers.getAddress(
        process.env.NEXT_PUBLIC_BOT_ADDRESS!
      )
      const provider = await activeWallet.getEthereumProvider()
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()

      const transaction = {
        to: formattedAddress,
        value: parsedAmount,
      }

      const gasLimit = await ethersProvider.estimateGas(transaction)
      const gasFees = (await ethersProvider.getFeeData()).gasPrice
      if (!gasFees) {
        console.error('Failed to get gas fees')
        return
      }

      const tx = await signer.sendTransaction({
        ...transaction,
        gasLimit: gasLimit,
        gasPrice: gasFees,
      })

      if (!tx) {
        throw new Error('Failed to send transaction')
      }

      const receipt = await tx.wait()
      if (!receipt) {
        throw new Error('Failed to get transaction receipt')
      }

      setTransactionHash(receipt?.hash)
    } catch (error) {
      console.error('Failed to send tokens', error)
    }
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-0">
      <div className="flex flex-col items-center flex-[1] py-4 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 relative">
        <div className="flex items-center justify-center mt-2 md:mt-8 mx-4 md:mx-8 h-40 w-40 overflow-hidden rounded-full bg-white relative">
          {/* <Avatar height={160} width={160} address={address} /> */}
          <div
            onClick={() => {
              router.push(`/${address}`)
              closeDialog()
            }}
            className="opacity-0 text-center hover:opacity-100 transition-all duration-300 bg-black/50 absolute top-0 left-0 w-full h-full flex items-center justify-center text-white/80 font-semibold text-sm cursor-pointer"
          >
            Dashboard <br />
            (Coming Soon)
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg">{formatAddress(address)}</span>
          {showCopySuccess ? (
            <HiCheck className="h-4 w-4 text-green-500" />
          ) : (
            <HiDuplicate
              className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={handleCopyAddress}
            />
          )}
        </div>
        <NetworkStatus
          chainName={chainName}
          isChainValid={isChainValid}
          onSwitchNetwork={onSwitchNetwork}
          isSwitching={isSwitching}
        />
      </div>

      <div className="flex flex-col justify-between flex-[2] p-4 relative md:max-w-[calc(66.7%-32px)]">
        {isPrivyManaged && (
          <div
            className="absolute top-0 left-2 md:-left-6 text-xs text-gray-400 py-2 flex items-center hover:text-gray-600 cursor-pointer"
            onClick={exportWallet}
          >
            <HiCog className="h-4 w-4 mr-1" />
            Managed by&nbsp;
            <span className="font-bold">Privy</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Balance</div>
            <div className="text-xl font-bold">{`${formatWeiBalance(
              balanceInWei,
              8
            )} ETH`}</div>
          </div>

          <div className="text-right">
            <div className="text-sm mb-1 text-gray-400">Sign Message</div>
            <TransactionInput
              label="Sign Message"
              value={message}
              placeholder="Paste 44 char secret here"
              hash={signature}
              onValueChange={setMessage}
              onSubmit={handleSignMessage}
              onClear={() => {
                setSignature('')
                setMessage('')
              }}
              buttonText="Sign"
              allowSubmit={Boolean(allowSignMessage)}
              type="text"
            />
          </div>

          <div className="text-right">
            <div className="text-sm mb-1 text-gray-400">Send Tokens</div>
            <TransactionInput
              label="Send Tokens"
              value={amount}
              placeholder="Enter commitment amount"
              hash={transactionHash}
              onValueChange={setAmount}
              onSubmit={handleSendTokens}
              onClear={() => {
                setAmount('')
                setTransactionHash('')
              }}
              buttonText="Send"
              allowSubmit={Boolean(allowSendTokens)}
              type="number"
            />
          </div>
        </div>

        <button
          onClick={async () => {
            await logout()
            closeDialog()
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 cursor-pointer mt-4"
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  )
}
