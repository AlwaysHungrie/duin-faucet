import dotenv from "dotenv";

dotenv.config();

const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL;

if (!BASE_SEPOLIA_RPC_URL) {
  throw new Error("Missing Base Sepolia RPC URL");
}

export const config = {
  BASE_SEPOLIA_RPC_URL,
};
