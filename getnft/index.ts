import { generateImage } from './services/imageGenerate'
import { uploadImageToS3, uploadMetadataToS3 } from './services/s3'
import { mintNft } from './services/nft'

interface GenerateImageRequest {
  idea: string
  address: string
}

interface LambdaResponse {
  error: string | null
  jsonResult: any | null
  transaction?: {
    txnRequest: any
    rpcUrl: string
  }
}

export const handler = async (event: any): Promise<LambdaResponse> => {
  try {
    const {
      idea,
      address,
    } = event as GenerateImageRequest

    if (!idea) {
      throw new Error('Idea is required')
    }

    if (!address) {
      throw new Error('Address is required')
    }

    
    console.log('Generating new image')
    const imageBuffer = await generateImage()
    if (!imageBuffer) {
      throw new Error('Failed to generate image')
    }

    console.log('Uploading image to S3')
    const { s3Url: newS3Url, filename: newFilename } = await uploadImageToS3(
      imageBuffer
    )
    if (!newS3Url) {
      throw new Error('Failed to upload image to S3')
    }

    const s3Url = newS3Url
    const filename = newFilename
    
    const { s3MetadataUrl } = await uploadMetadataToS3(idea, s3Url)
    if (!s3MetadataUrl) {
      throw new Error('Failed to upload metadata to S3')
    }

    console.log('Minting NFT')
    const { txnRequest, rpcUrl } = await mintNft(address, s3MetadataUrl)
    return {
      error: null,
      jsonResult: {
        s3Url,
        s3MetadataUrl,
      },
      transaction: {
        txnRequest,
        rpcUrl,
      },
    }
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : 'Unknown error',
      jsonResult: null,
    }
  }
}

// ;(async () => {
//   const result = await handler({
//     idea: 'A crystal ball with a message from the future',
//     address: '0x43Cb32825f0A1CBaC2fd6B11a18f46aa81D142f4',
//   })

//   console.log(result)
// })()
