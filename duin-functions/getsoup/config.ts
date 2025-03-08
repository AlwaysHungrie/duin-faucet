import dotenv from "dotenv";

dotenv.config();

const IAWS_ACCESS_KEY_ID = process.env.IAWS_ACCESS_KEY_ID;
const IAWS_SECRET_ACCESS_KEY = process.env.IAWS_SECRET_ACCESS_KEY;
const IAWS_REGION = process.env.IAWS_REGION;
const IS3_BUCKET_NAME = process.env.IS3_BUCKET_NAME;

if (!IAWS_ACCESS_KEY_ID || !IAWS_SECRET_ACCESS_KEY || !IAWS_REGION || !IS3_BUCKET_NAME) {
  throw new Error("Missing AWS credentials or region or S3 bucket name");
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API key");
}

const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL;

if (!BASE_SEPOLIA_RPC_URL) {
  throw new Error("Missing Base Sepolia RPC URL");
}

export const config = {
  IAWS_ACCESS_KEY_ID,
  IAWS_SECRET_ACCESS_KEY,
  IAWS_REGION,
  IS3_BUCKET_NAME,
  OPENAI_API_KEY,
  BASE_SEPOLIA_RPC_URL,
};
