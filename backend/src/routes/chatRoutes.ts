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

    const responseMessage = await addUserMessage(chatId, message)
    res.json({ responseMessage, success: true })
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
