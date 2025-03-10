import dotenv from "dotenv";

dotenv.config();

const SCROLL_SEPOLIA_RPC_URL = process.env.SCROLL_SEPOLIA_RPC_URL;

if (!SCROLL_SEPOLIA_RPC_URL) {
  throw new Error("Missing Scroll Sepolia RPC URL");
}

export const config = {
  SCROLL_SEPOLIA_RPC_URL,
};
