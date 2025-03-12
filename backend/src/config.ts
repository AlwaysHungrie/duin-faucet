import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret'

const PRIVY_PUBLIC_KEY = process.env.PRIVY_PUBLIC_KEY || 'privy-public-key'
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET || 'privy-app-secret'
const PRIVY_APP_ID = process.env.PRIVY_APP_ID || 'privy-app-id'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

const NOTARY_HOST = process.env.NOTARY_HOST || '127.0.0.1'
const NOTARY_PORT = process.env.NOTARY_PORT || 7047
const NOTARY_TLS = process.env.NOTARY_TLS === 'true' || false

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'aws-access-key-id'
const AWS_SECRET_ACCESS_KEY =
  process.env.AWS_SECRET_ACCESS_KEY || 'aws-secret-access-key'
const AWS_REGION = process.env.AWS_REGION || 'aws-region'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'openai-api-key'

const RUST_BINARY_PATH =
  process.env.RUST_BINARY_PATH ||
  '../rust_tlsn_llm/target/release/rust_tlsn_llm'
const RUST_VERIFIER_BINARY_PATH =
  process.env.RUST_VERIFIER_BINARY_PATH ||
  '../rust_tlsn_llm_verifier/target/release/rust_tlsn_llm_verifier'

const AGENT_ADDRESS = process.env.AGENT_ADDRESS
if (!AGENT_ADDRESS) {
  throw new Error('AGENT_ADDRESS is not set')
}

const CONSTELLA_URL =
  process.env.CONSTELLA_URL || 'https://api.constella.one/api/v1'

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS
if (!NFT_CONTRACT_ADDRESS) {
  throw new Error('NFT_CONTRACT_ADDRESS is not set')
}

const RPC_URL = process.env.RPC_URL || 'https://sepolia-rpc.scroll.io'

const TWITTER_API_KEY = process.env.TWITTER_API_KEY
const TWITTER_API_KEY_SECRET = process.env.TWITTER_API_KEY_SECRET
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET

if (
  !TWITTER_API_KEY ||
  !TWITTER_API_KEY_SECRET ||
  !TWITTER_BEARER_TOKEN ||
  !TWITTER_ACCESS_TOKEN ||
  !TWITTER_ACCESS_TOKEN_SECRET ||
  !TWITTER_CLIENT_ID ||
  !TWITTER_CLIENT_SECRET
) {
  throw new Error('twitter config is not set')
}

export default {
  PORT,
  JWT_SECRET,
  PRIVY_PUBLIC_KEY,
  PRIVY_APP_SECRET,
  PRIVY_APP_ID,
  FRONTEND_URL,
  BACKEND_URL,
  NOTARY_HOST,
  NOTARY_PORT,
  NOTARY_TLS,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  OPENAI_API_KEY,
  RUST_BINARY_PATH,
  RUST_VERIFIER_BINARY_PATH,
  AGENT_ADDRESS,
  CONSTELLA_URL,
  NFT_CONTRACT_ADDRESS,
  RPC_URL,
  TWITTER_API_KEY,
  TWITTER_API_KEY_SECRET,
  TWITTER_BEARER_TOKEN,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET,
}
