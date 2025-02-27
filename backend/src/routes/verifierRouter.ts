import express from 'express'

import { executeVerifier } from '../services/llmVerifierService'
import { asyncHandler } from '../middleware/misc'
import { AuthenticatedRequest, jwtMiddleware } from '../middleware/jwt'
import createError from 'http-errors'
import { generateOneTimeDownloadUrl } from '../services/s3Service'
const router = express.Router()

router.get(
  '/verify',
  jwtMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
    const { fileKey } = req.query
    if (!fileKey) {
      throw createError(400, 'File key is required')
    }
    const result = await executeVerifier({ fileKey: fileKey as string })
    res.json({ success: true, result })
  })
)

router.get(
  '/download',
  jwtMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
    const { attestation } = req.query
    const keys = (attestation as string).split('/')
    const fileKey = keys[keys.length - 1]
    const bucketKey = keys[keys.length - 2]
    const key = `${bucketKey}/${fileKey}`
    const presignedUrl = await generateOneTimeDownloadUrl(
      'tlsn-notary-test',
      key
    )
    if (!presignedUrl) {
      throw createError(500, 'Failed to generate presigned URL')
    }
    console.log(presignedUrl.downloadUrl)
    res.json({ success: true, url: presignedUrl.downloadUrl })
  })
)

export default router
