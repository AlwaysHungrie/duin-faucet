import { config } from '../config'
import { ChunkyNft__factory } from '../typechain-types'
import { ethers } from 'ethers'
import prisma from '../prismaClient'

const { BASE_SEPOLIA_RPC_URL } = config

export const mintNft = async (address: string, metadataUrl: string) => {
  const contracts = await prisma.contract.findMany()
  const contractAddress = contracts[0].address
  const contract = ChunkyNft__factory.connect(contractAddress)
  const unsignedTx = await contract.mintAndTransfer.populateTransaction(
    address,
    metadataUrl
  )
  const txnRequest = {
    to: contractAddress,
    data: unsignedTx.data,
    value: unsignedTx.value || 0,
    gasLimit: unsignedTx.gasLimit,
  }
  return {
    txnRequest,
    rpcUrl: BASE_SEPOLIA_RPC_URL,
  }
  // const receipt = await tx.wait()
  // if (!receipt) {
  //   throw new Error('Transaction failed')
  // }

  // const logs = receipt.logs
  // console.log('logs', logs)

  // const mintedEvent = receipt?.logs
  //   .filter(log => log.topics[0] === contract.interface.getEvent("NFTMinted").topicHash)
  //   .map(log => contract.interface.parseLog(log))[0];

  // console.log('mintedEvent', mintedEvent)

  // const tokenId = mintedEvent?.args[0].toString()
  // const txnHash = receipt?.logs[0].transactionHash
  // return { txnHash, tokenId }
}

export const burnNft = async (tokenId: string) => {
  const contracts = await prisma.contract.findMany()
  const contractAddress = contracts[0].address
  const contract = ChunkyNft__factory.connect(contractAddress)
  
  const tx = await contract.burnNFT(BigInt(tokenId))
  const receipt = await tx.wait()
  if (!receipt) {
    throw new Error('Transaction failed')
  }

  const logs = receipt.logs
  console.log('logs', logs)

  const txnHash = receipt?.logs[0].transactionHash
  return { txnHash }
}
