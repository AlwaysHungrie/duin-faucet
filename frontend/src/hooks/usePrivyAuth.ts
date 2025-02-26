import { useEffect, useState, useCallback } from 'react'
import { ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth'
import { formatAddress } from '@/utils/formatting'
import axios from 'axios'

/**
 * Custom hook for managing Privy authentication in a Next.js application
 * Handles loading states, connection status, wallet connection, and disconnection
 *
 * @returns {Object} Authentication state and methods
 */
const usePrivyAuth = () => {
  // Get Privy's built-in hooks and methods
  const {
    ready,
    authenticated,
    user,
    login,
    logout,
    connectWallet,
    linkWallet,
    unlinkWallet,
    getAccessToken,
  } = usePrivy()

  const { wallets } = useWallets()

  const disconnectWallet = useCallback(
    async (walletId: string) => {
      console.log('disconnecting wallet', walletId)
      await logout()
    },
    [logout]
  )

  // Additional state for derived values and enhanced UX
  const [isLoading, setIsLoading] = useState(true)
  const [currentWallet, setCurrentWallet] = useState<ConnectedWallet | null>(
    null
  )
  const [walletAddress, setWalletAddress] = useState('')
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const [jwtToken, setJwtToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      setJwtToken(token)
    }
  }, [])

  // Update the loading state based on Privy's ready status
  useEffect(() => {
    if (ready) {
      setIsLoading(false)
    }
  }, [ready])

  // Update the current wallet when the wallets array changes
  useEffect(() => {
    if (wallets && wallets.length > 0) {
      // Set the first wallet as the current one (can be customized)
      const primaryWallet = wallets[0]
      setCurrentWallet(primaryWallet)

      // Set the wallet address if available
      if (primaryWallet && primaryWallet.address) {
        setWalletAddress(primaryWallet.address)
      }
    } else {
      setCurrentWallet(null)
      setWalletAddress('')
    }
  }, [wallets])

  // Enhanced connect wallet function with error handling
  const handleConnectWallet = useCallback(async () => {
    try {
      setConnectionError(null)
      await connectWallet()
      return true
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      if (error instanceof Error) {
        setConnectionError(error.message || 'Failed to connect wallet')
      } else {
        setConnectionError('Failed to connect wallet')
      }
      return false
    }
  }, [connectWallet])

  // Enhanced disconnect wallet function with error handling
  const handleDisconnectWallet = useCallback(async () => {
    try {
      if (currentWallet) {
        await disconnectWallet(currentWallet.address)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      if (error instanceof Error) {
        setConnectionError(error.message || 'Failed to disconnect wallet')
      } else {
        setConnectionError('Failed to disconnect wallet')
      }
      return false
    }
  }, [disconnectWallet, currentWallet])

  // Login with error handling
  const handleLogin = useCallback(async () => {
    try {
      setConnectionError(null)
      await login()
      return true
    } catch (error) {
      console.error('Failed to login:', error)
      if (error instanceof Error) {
        setConnectionError(error.message || 'Failed to login')
      } else {
        setConnectionError('Failed to login')
      }
      return false
    }
  }, [login])

  // Logout with error handling
  const handleLogout = useCallback(async () => {
    try {
      await logout()
      localStorage.removeItem('jwtToken')
      setJwtToken(null)
      return true
    } catch (error) {
      console.error('Failed to logout:', error)
      if (error instanceof Error) {
        setConnectionError(error.message || 'Failed to logout')
      } else {
        setConnectionError('Failed to logout')
      }
      return false
    }
  }, [logout])

  const getJwtToken = useCallback(async (address: string) => {
    console.log('getting jwt token', address)
    const privyToken = await getAccessToken()
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/token`, {
      params: {
        address,
      },
      headers: {
        Authorization: `Bearer ${privyToken}`,
      },
    })
    localStorage.setItem('jwtToken', response.data.token)
    setJwtToken(response.data.token)
  }, [getAccessToken])

  useEffect(() => {
    if (jwtToken) {
      return
    }
    if (authenticated && user && user.wallet) {
      getJwtToken(user.wallet.address)
    }
  }, [user, authenticated, getJwtToken, jwtToken])

  return {
    // Status
    isLoading,
    isAuthenticated: authenticated,
    isWalletConnected: !!currentWallet,

    // User and wallet data
    authenticatedUser: authenticated && user,
    user,
    wallets,
    currentWallet,
    walletAddress,
    formattedWalletAddress: formatAddress(walletAddress),

    // Error state
    error: connectionError,

    // Actions
    login: handleLogin,
    logout: handleLogout,
    connectWallet: handleConnectWallet,
    disconnectWallet: handleDisconnectWallet,
    linkWallet,
    unlinkWallet,

    // Raw Privy access (for advanced use cases)
    privyReady: ready,

    // JWT token
    jwtToken,
  }
}

export default usePrivyAuth
