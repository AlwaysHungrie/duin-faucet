import config from '../config'
import { ethers } from 'ethers'
import { DuinNft__factory } from '../typechain-types'
import axios from 'axios';

const { NFT_CONTRACT_ADDRESS, RPC_URL } = config

// ERC-721 minimal ABI - just what we need for querying
const minimalABI = [
  // balanceOf
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  // ownerOf
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  // tokenURI
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Get events for transfer analysis
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "from", "type": "address"},
      {"indexed": true, "name": "to", "type": "address"},
      {"indexed": true, "name": "tokenId", "type": "uint256"}
    ],
    "name": "Transfer",
    "type": "event"
  },
  // Custom DuinNft event
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "name": "tokenId", "type": "uint256"},
      {"indexed": false, "name": "recipient", "type": "address"},
      {"indexed": false, "name": "tokenURI", "type": "string"}
    ],
    "name": "NFTMinted",
    "type": "event"
  }
];

export const getLastestNft = async (address: string, tokenId: number) => {
  
  try {
    const userAddress = ethers.getAddress(address)
    const contractAddress = ethers.getAddress(NFT_CONTRACT_ADDRESS)

    const provider = new ethers.JsonRpcProvider(RPC_URL)

    const contract = new ethers.Contract(contractAddress, minimalABI, provider)
    const balance = await contract.balanceOf(userAddress)
    if (balance === BigInt(0)) {
      return null
    }

    const tokenOwner = await contract.ownerOf(tokenId)
    console.log('tokenOwner', tokenOwner)
    if (tokenOwner !== userAddress) {
      return null
    }

    const tokenURI = await contract.tokenURI(tokenId)
    console.log('tokenURI', tokenURI)

    const nftData = await axios.get(tokenURI)
    console.log('nftData', nftData)

    return nftData?.data || null
  } catch (error) {
    console.error('Error getting balance of tokens', error)
    return null
  }
}