import { ChunkyNft__factory } from './typechain-types'
import { config } from './config'

interface LambdaResponse {
  error: string | null
  jsonResult: any
  transaction: {
    txnRequest: any
    rpcUrl: string
  } | null
}

const {
  BASE_SEPOLIA_RPC_URL,
} = config

const contract = new ChunkyNft__factory()

export const handler = async (event: any): Promise<LambdaResponse> => {
  try {
    const deploymentData = await contract.getDeployTransaction()
    const txnRequest = {
      to: '',
      data: deploymentData.data,
      value: 0,
      gasLimit: 1000000,
    }
    return {
      error: null,
      jsonResult: null,
      transaction: {
        txnRequest,
        rpcUrl: BASE_SEPOLIA_RPC_URL,
      },
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      jsonResult: null,
      transaction: null,
    }
  }
}

// ;(async () => {
//   const result = await handler({})
//   console.log(result)
// })()
