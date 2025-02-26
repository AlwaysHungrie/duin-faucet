import express from 'express'
import { AuthenticatedRequest, jwtMiddleware } from '../middleware/jwt'
import { asyncHandler } from '../middleware/misc'
import { getUserByAddress } from '../services/userService'
import createError from 'http-errors'
import { deleteChats, getChats } from '../services/chatService'

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

export default router
