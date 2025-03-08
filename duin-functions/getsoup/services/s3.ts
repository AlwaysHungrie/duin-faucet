import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { config } from '../config'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { getSortedIngredientsList } from './ingredients'

const formatTime = (ingredients: string[], time: Date) => {
  let formattedIngredients = ingredients[ingredients.length - 1]
  if (ingredients.length > 1) {
    formattedIngredients = `${ingredients.slice(0, -1).join(', ')} and ${formattedIngredients}`
  }

  // return HH:MM AM/PM, DDth MMM YY
  const hours = time.getHours()
  const minutes = time.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12

  const formattedTime = `${formattedIngredients} @${hours12}:${minutes
    .toString()
    .padStart(2, '0')} ${ampm}`
  return formattedTime
}

const { IAWS_REGION, IAWS_ACCESS_KEY_ID, IAWS_SECRET_ACCESS_KEY, IS3_BUCKET_NAME } =
  config

console.log('AWS_REGION', IAWS_REGION)
console.log('AWS_ACCESS_KEY_ID', IAWS_ACCESS_KEY_ID)
console.log('AWS_SECRET_ACCESS_KEY', IAWS_SECRET_ACCESS_KEY)
console.log('S3_BUCKET_NAME', IS3_BUCKET_NAME)

// Initialize S3 client
const s3Client = new S3Client({
  region: IAWS_REGION,
  credentials: {
    accessKeyId: IAWS_ACCESS_KEY_ID,
    secretAccessKey: IAWS_SECRET_ACCESS_KEY,
  },
})

export const getS3Url = async (ingredients: string[]) => {
  try {
    const filename = await getSortedIngredientsList(ingredients)
    const folderName = 'images'
    // check if the file exists in the s3 bucket
    const command = new GetObjectCommand({
      Bucket: IS3_BUCKET_NAME,
      Key: `${folderName}/${filename}.png`,
      ResponseContentType: 'image/png',
    })
    const response = await s3Client.send(command)
    console.log('response', response)
    if (!response) {
      return {
        s3Url: null,
        filename: null,
      }
    }

    const s3Url = `https://${IS3_BUCKET_NAME}.s3.${IAWS_REGION}.amazonaws.com/${folderName}/${filename}.png`
    return {
      s3Url,
      filename,
    }
  } catch (error) {
    console.log('Error getting S3 URL:', error)
    return {
      s3Url: null,
      filename: null,
    }
  }
}

export const uploadImageToS3 = async (ingredients: string[], imageUrl: string, forceGenerate = false) => {
  const folderName = 'images'
  // Download the image
  const imageResponse = await axios.get(imageUrl, {
    responseType: 'arraybuffer',
  })
  const imageBuffer = Buffer.from(imageResponse.data)

  // Generate a unique filename
  let key = await getSortedIngredientsList(ingredients)
  if (forceGenerate) {
    key = `${uuidv4()}`
  }
  const filename = `${folderName}/${key}.png`

  const command = new PutObjectCommand({
    Bucket: IS3_BUCKET_NAME,
    Key: filename,
    Body: imageBuffer,
    ContentType: 'image/png',
  })

  const response = await s3Client.send(command)
  if (!response) {
    throw new Error('Failed to upload image to S3')
  }

  const s3Url = `https://${IS3_BUCKET_NAME}.s3.${IAWS_REGION}.amazonaws.com/${filename}`
  return {
    s3Url,
    filename,
  }
}

export const uploadMetadataToS3 = async (
  ingredients: string[],
  s3Url: string
) => {
  const folderName = 'metadata'
  const filename = `${folderName}/${uuidv4()}.json`
  const now = new Date()
  const formattedTime = formatTime(ingredients, now)

  const metadata = {
    name: formattedTime,
    description: 'A steaming bowl of soup with the ingredients you love',
    image: s3Url,
    attributes: ingredients.map((ingredient) => ({
      trait_type: 'Ingredient',
      value: ingredient,
    })),
  }

  const command = new PutObjectCommand({
    Bucket: IS3_BUCKET_NAME,
    Key: filename,
    Body: JSON.stringify(metadata),
    ContentType: 'application/json',
  })

  const response = await s3Client.send(command)
  if (!response) {
    throw new Error('Failed to upload metadata to S3')
  }

  const s3MetadataUrl = `https://${IS3_BUCKET_NAME}.s3.${IAWS_REGION}.amazonaws.com/${filename}`
  return {
    s3MetadataUrl,
    filename,
  }
}
