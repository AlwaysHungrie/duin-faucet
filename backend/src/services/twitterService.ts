import { TwitterApi } from 'twitter-api-v2'
import config from '../config'

const twitterClient = new TwitterApi({
  appKey: config.TWITTER_API_KEY,
  appSecret: config.TWITTER_API_KEY_SECRET,
  accessToken: config.TWITTER_ACCESS_TOKEN,
  accessSecret: config.TWITTER_ACCESS_TOKEN_SECRET,
})

const extractTweetIdFromUrl = (url: string) => {
  // Regular expressions for different Twitter URL formats
  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/, // Standard format: https://twitter.com/username/status/1234567890
    /x\.com\/\w+\/status\/(\d+)/, // New X.com format: https://x.com/username/status/1234567890
    /twitter\.com\/i\/web\/status\/(\d+)/, // Web app format
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

export const retweet = async (tweetUrl: string) => {
  try {
    const tweetId = extractTweetIdFromUrl(tweetUrl)
    if (!tweetId) {
      throw new Error('Invalid tweet URL')
    }
    const user = await twitterClient.currentUserV2()
    const result = await twitterClient.v2.retweet(user.data.id, tweetId)
    return result
  } catch (error) {
    console.log(error)
    return null
  }
}
