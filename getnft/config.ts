import dotenv from "dotenv";

dotenv.config();

const IAWS_ACCESS_KEY_ID = process.env.IAWS_ACCESS_KEY_ID;
const IAWS_SECRET_ACCESS_KEY = process.env.IAWS_SECRET_ACCESS_KEY;
const IAWS_REGION = process.env.IAWS_REGION;
const IS3_BUCKET_NAME = process.env.IS3_BUCKET_NAME;

if (!IAWS_ACCESS_KEY_ID || !IAWS_SECRET_ACCESS_KEY || !IAWS_REGION || !IS3_BUCKET_NAME) {
  throw new Error("Missing AWS credentials or region or S3 bucket name");
}

const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL;
const SCROLL_SEPOLIA_RPC_URL = process.env.SCROLL_SEPOLIA_RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;

export const config = {
  IAWS_ACCESS_KEY_ID,
  IAWS_SECRET_ACCESS_KEY,
  IAWS_REGION,
  IS3_BUCKET_NAME,
  BASE_SEPOLIA_RPC_URL,
  SCROLL_SEPOLIA_RPC_URL,
  CONTRACT_ADDRESS,
};
