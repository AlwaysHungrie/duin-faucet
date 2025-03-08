import { generateImage } from './services/imageGenerate'
import { getS3Url, uploadImageToS3, uploadMetadataToS3 } from './services/s3'
import { mintNft } from './services/nft'
import { checkIfIngredientsExist } from './services/ingredients'

interface GenerateImageRequest {
  ingredients: string[]
  address: string
  forceGenerate?: boolean
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
      ingredients,
      address,
      forceGenerate = false,
    } = event as GenerateImageRequest

    if (
      !ingredients ||
      ingredients.length === 0 ||
      !Array.isArray(ingredients)
    ) {
      throw new Error('Ingredients are required')
    }

    if (!address) {
      throw new Error('Address is required')
    }

    const missingIngredients = await checkIfIngredientsExist(ingredients)
    if (missingIngredients.length > 0) {
      throw new Error(`Ingredients missing: ${missingIngredients.join(', ')}`)
    }

    let { s3Url = null, filename = null } = await getS3Url(ingredients)
    if (!s3Url || forceGenerate) {
      console.log('Generating new image')
      const imageUrl = await generateImage(ingredients)

      if (!imageUrl) {
        throw new Error('Failed to generate image')
      }

      console.log('Uploading image to S3')
      const { s3Url: newS3Url, filename: newFilename } = await uploadImageToS3(
        ingredients,
        imageUrl,
        forceGenerate
      )
      if (!newS3Url) {
        throw new Error('Failed to upload image to S3')
      }

      s3Url = newS3Url
      filename = newFilename
    }

    const { s3MetadataUrl } = await uploadMetadataToS3(ingredients, s3Url)
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

;(async () => {
  const result = await handler({
    ingredients: ['tomatoes'],
    address: '0x43Cb32825f0A1CBaC2fd6B11a18f46aa81D142f4',
    forceGenerate: false,
  })

  console.log(result)
})()
