import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import config from '../config'

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = config

export async function generateOneTimeDownloadUrl(
  bucketName: string,
  objectKey: string
) {
  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  })

  // Create the command
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  })

  try {
    // Generate pre-signed URL that expires in 5 minutes
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes in seconds
    })

    return {
      downloadUrl: url,
      expiresAt: new Date(Date.now() + 300 * 1000).toISOString(),
    }
  } catch (error) {
    console.error('Error generating pre-signed URL:', error)
  }
}

export async function generateOneTimeUploadUrl(
  bucketName: string,
  objectKey: string,
  fileType: string
) {
  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  })

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: fileType,
  })

  try {
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes in seconds
    })

    return {
      uploadUrl: url,
      expiresAt: new Date(Date.now() + 300 * 1000).toISOString(),
      publicUrl: `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${objectKey}`,
    }
  } catch (error) {
    console.error('Error generating pre-signed URL:', error)
  }
}
