import express from 'express'
import { AuthenticatedRequest, jwtMiddleware } from '../middleware/jwt'
import { asyncHandler } from '../middleware/misc'
import { getUserByAddress } from '../services/userService'
import createError from 'http-errors'
import {
  addUserMessage,
  clearChat,
  deleteChats,
  getChats,
  getPreviousMessages,
} from '../services/chatService'
import { generateOneTimeUploadUrl } from '../services/s3Service'

const router = express.Router()

router.get(
  '/',
  jwtMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
    const user = await getUserByAddress(req.user.address)
    if (!user) {
      throw createError(404, 'User not found')
    }
    const chats = await getChats(user.id)
    res.json({ chats, success: true })
  })
)

router.delete(
  '/',
  jwtMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
    const user = await getUserByAddress(req.user.address)
    if (!user) {
      throw createError(404, 'User not found')
    }
    await deleteChats(user.id)
    res.json({ success: true })
  })
)

router.post(
  '/message',
  jwtMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
    const user = await getUserByAddress(req.user.address)
    if (!user) {
      throw createError(404, 'User not found')
    }

    const { chatId, message } = req.body
    if (!chatId || !message) {
      throw createError(400, 'Chat ID and message are required')
    }

    const { responseMessage, nftMessage } = await addUserMessage(chatId, message, user.address)
    res.json({ responseMessage, nftMessage, success: true })
  })
)

router.get(
  '/upload-url',
  jwtMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
    const user = await getUserByAddress(req.user.address)
    if (!user) {
      throw createError(404, 'User not found')
    }

    const { fileKey } = req.query
    if (!fileKey) {
      throw createError(400, 'File key is required')
    }

    const fileType = req.query.fileType as string
    if (!fileType) {
      throw createError(400, 'File type is required')
    }

    const url = await generateOneTimeUploadUrl(
      'public-tlsn-notary-test',
      fileKey as string,
      fileType
    )
    res.json({ url, success: true })
  })
)

router.get(
  '/:chatId',
  jwtMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
    const user = await getUserByAddress(req.user.address)
    if (!user) {
      throw createError(404, 'User not found')
    }

    let beforeTimestamp = new Date(req.query.beforeTimestamp as string)
    if (!beforeTimestamp) {
      beforeTimestamp = new Date()
    }

    const { messages, hasMoreMessages } = await getPreviousMessages(
      req.params.chatId,
      beforeTimestamp
    )
    res.json({ messages, hasMoreMessages, success: true })
  })
)

router.delete(
  '/:chatId',
  jwtMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
    await clearChat(req.params.chatId)
    res.json({ success: true })
  })
)

export default router
