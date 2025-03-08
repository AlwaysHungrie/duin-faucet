import prisma from './prismaClient'

interface LambdaResponse {
  error: string | null
  jsonResult: any
  transaction: {
    txnRequest: any
    rpcUrl: string
  } | null
}

export const handler = async (event: any): Promise<LambdaResponse> => {
  try {
    const contractAddress = event.contractAddress
    if (!contractAddress) {
      throw new Error('Contract address is required')
    }

    // find all contracts
    const contracts = await prisma.contract.findMany({})
    if (contracts.length > 0) {
      const contract = contracts[0]

      await prisma.contract.update({
        where: {
          address: contract.address,
        },
        data: {
          address: contractAddress,
        },
      })

      return {
        error: null,
        jsonResult: 'Contract already exists',
        transaction: null,
      }
    }

    await prisma.contract.create({
      data: {
        address: contractAddress,
      },
    })
    return {
      error: null,
      jsonResult: 'Contract address created',
      transaction: null,
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
