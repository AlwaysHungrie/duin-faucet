import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import {
  ConnectedWallet,
  usePrivy,
  User,
  useWallets,
} from '@privy-io/react-auth'
import { formatAddress } from '@/utils/formatting'
import axios from 'axios'

// Define the context type
interface PrivyAuthContextType {
  isLoading: boolean
  isAuthenticated: boolean
  isWalletConnected: boolean
  authenticatedUser: User | null
  user: User | null
  wallets: ConnectedWallet[]
  currentWallet: ConnectedWallet | null
  walletAddress: string
  formattedWalletAddress: string
  error: string | null
  login: () => Promise<boolean>
  logout: () => Promise<boolean>
  connectWallet: () => Promise<boolean>
  disconnectWallet: () => Promise<boolean>
  privyReady: boolean
  jwtToken: string | null
  refreshToken: () => Promise<string | null> // Added refreshToken function
}

// Create the context
const PrivyAuthContext = createContext<PrivyAuthContextType | null>(null)

// Create the provider component
export function PrivyAuthProvider({ children }: { children: ReactNode }) {
  // Get Privy's built-in hooks and methods
  const {
    ready,
    authenticated,
    user,
    login,
    logout,
    connectWallet,
    getAccessToken,
  } = usePrivy()

  const { wallets } = useWallets()

  // Additional state for derived values and enhanced UX
  const [isLoading, setIsLoading] = useState(true)
  const [currentWallet, setCurrentWallet] = useState<ConnectedWallet | null>(
    null
  )
  const [walletAddress, setWalletAddress] = useState('')
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [jwtToken, setJwtToken] = useState<string | null>(null)

  // Initialize token from localStorage on component mount
  useEffect(() => {
    if (!authenticated || !user) return
    const storedToken = localStorage.getItem('jwtToken')
    if (storedToken) {
      console.log('Initializing token from localStorage')
      setJwtToken(storedToken)
    }
  }, [authenticated, user])

  const disconnectWallet = useCallback(
    async (walletId: string) => {
      console.log('disconnecting wallet', walletId)
      await logout()
    },
    [logout]
  )

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

  // Improved getJwtToken function
  const getJwtToken = useCallback(
    async (address: string): Promise<string | null> => {
      try {
        console.log('Getting JWT token for address:', address)
        const privyToken = await getAccessToken()

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/token`,
          {
            params: { address },
            headers: { Authorization: `Bearer ${privyToken}` },
          }
        )

        const tokenData = response.data.token
        console.log('Received new JWT token')

        // Force a new reference to trigger renders
        localStorage.setItem('jwtToken', tokenData)

        // Important: Use a function updater to ensure we're always using the latest state
        setJwtToken(() => tokenData)

        return tokenData
      } catch (error) {
        console.log('Error getting JWT token:', error)
        logout()
        return null
      }
    },
    [getAccessToken]
  )

  // Added a public refresh token method that components can call
  const refreshToken = useCallback(async (): Promise<string | null> => {
    if (authenticated && user && user.wallet) {
      return getJwtToken(user.wallet.address)
    }
    return null
  }, [authenticated, user, getJwtToken])

  // Get token on auth changes
  useEffect(() => {
    const fetchTokenIfNeeded = async () => {
      // Only fetch if authenticated and we have wallet info
      if (authenticated && user && user.wallet) {
        // Check if we need a token (no token or force refresh)
        if (!jwtToken) {
          console.log('No token available, fetching new one')
          await getJwtToken(user.wallet.address)
        }
      }
    }

    fetchTokenIfNeeded()
  }, [authenticated, user, getJwtToken, jwtToken])

  // Create the context value with all the state and methods
  const value: PrivyAuthContextType = {
    isLoading,
    isAuthenticated: authenticated,
    isWalletConnected: !!currentWallet,
    authenticatedUser: authenticated && user ? user : null,
    user,
    wallets,
    currentWallet,
    walletAddress,
    formattedWalletAddress: formatAddress(walletAddress),
    error: connectionError,
    login: handleLogin,
    logout: handleLogout,
    connectWallet: handleConnectWallet,
    disconnectWallet: handleDisconnectWallet,
    privyReady: ready,
    jwtToken,
    refreshToken, // Added refreshToken function to the context
  }

  return (
    <PrivyAuthContext.Provider value={value}>
      {children}
    </PrivyAuthContext.Provider>
  )
}

// Create the custom hook to use the context
export function usePrivyAuth() {
  const context = useContext(PrivyAuthContext)
  if (!context) {
    throw new Error('usePrivyAuth must be used within a PrivyAuthProvider')
  }
  return context
}
