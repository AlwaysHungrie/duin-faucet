import { config } from './config'
import { parseEther } from 'ethers'

interface LambdaResponse {
  error: string | null
  jsonResult: any
  transaction: {
    txnRequest: any
    rpcUrl: string
  } | null
}

interface SendEthRequest {
  address: string
  amount: string
}

const {
  SCROLL_SEPOLIA_RPC_URL,
} = config


export const handler = async (event: any): Promise<LambdaResponse> => {
  try {
    const {
      address,
      amount,
    } = event as SendEthRequest

    const valueInEth = amount

    const valueInWei = parseEther(valueInEth)

    const txnRequest = {
      to: address,
      data: '',
      value: valueInWei,
      gasLimit: 1000000,
    }
    return {
      error: null,
      jsonResult: null,
      transaction: {
        txnRequest,
        rpcUrl: SCROLL_SEPOLIA_RPC_URL,
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
