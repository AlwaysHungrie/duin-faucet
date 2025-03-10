import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { config } from '../config'
import { v4 as uuidv4 } from 'uuid'

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

export const uploadImageToS3 = async (image: ArrayBuffer) => {
  const folderName = 'images'
  const imageBuffer = Buffer.from(image)

  // Generate a unique filename
  const key = `${uuidv4()}`
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
  idea: string,
  s3Url: string
) => {
  const folderName = 'metadata'
  const filename = `${folderName}/${uuidv4()}.json`
  const now = new Date()

  const metadata = {
    name: 'Crystal Ball',
    description: 'A crystal ball with a message from the future',
    image: s3Url,
    attributes: [
      {
        trait_type: 'Idea',
        value: idea,
      },
    ],
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
