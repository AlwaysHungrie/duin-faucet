import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret'

const PRIVY_PUBLIC_KEY = process.env.PRIVY_PUBLIC_KEY || 'privy-public-key'
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET || 'privy-app-secret'
const PRIVY_APP_ID = process.env.PRIVY_APP_ID || 'privy-app-id'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

export default {
  PORT,
  JWT_SECRET,
  PRIVY_PUBLIC_KEY,
  PRIVY_APP_SECRET,
  PRIVY_APP_ID,
  FRONTEND_URL,
}
