import { base, scroll, mainnet } from 'viem/chains'
import { HOME_PAGE } from './copy/home'

const BASE = {
  ...base,
  rpcUrls: {
    ...base.rpcUrls,
    privyWalletOverride: {
      http: [process.env.BASE_RPC_URL!],
    },
  },
}

const ETHEREUM = {
  ...mainnet,
  rpcUrls: {
    ...mainnet.rpcUrls,
    privyWalletOverride: {
      http: [process.env.ETHEREUM_RPC_URL!],
    },
  },
}

const SCROLL = {
  ...scroll,
  rpcUrls: {
    ...scroll.rpcUrls,
    privyWalletOverride: {
      http: [process.env.SCROLL_RPC_URL!],
    },
  },
}

export const CONFIG = {
  TELEGRAM_URL: 'https://t.me/getduinbot',
  X_URL: 'https://x.com/getduinbot',
  VALID_CHAINS: {
    base: BASE.id,
    ethereum: ETHEREUM.id,
    scroll: SCROLL.id,
  },
  VALID_CHAINS_LABELS: {
    'eip155:8453': 'Base',
    'eip155:1': 'Ethereum',
    'eip155:534352': 'Scroll',
  },
  SUPPORTED_CHAINS: [
    BASE,
    SCROLL,
    ETHEREUM,
  ],
  COPY: {
    HOME: HOME_PAGE
  }
}
