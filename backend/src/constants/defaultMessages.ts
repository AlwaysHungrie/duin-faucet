export const defaultChatNames = [
  'duin',
  'scorekeeper',
  'self',
  'towncrier',
] as const

export const defaultMessages = {
  duin: "Greetings, seeker of knowledge! I am the Duin, ready to assess the merits of your creation. Share with me my Scorekeeper's findings, and I shall render my mystical judgment upon your work and grant you the tools to develop it further.",
  scorekeeper:
    "Hey there! I'm the Scorekeeper. I will provide detailed feedback and a scorecard for your project idea. You can download each message I send as a scorecard and use it to get rewards while talking to Duin that will help you get your project off the ground.",
  self: 'This is your personal space. Messages sent here do not have any proofs attached to them and cannot be consumed by Duin and his minions.',
  towncrier:
    "Yap, yap, yap. Did Duin send like your idea so much that he granted you an NFT along with test tokens? I can yap about your project from Duin's twitter account. Just share the link of your tweet that you would like for me to repost, once per day. Please provide me the token ID of the NFT you hold in the following format: Token ID: <tokenId> followed by your tweet link.",
} as {
  [key in (typeof defaultChatNames)[number]]: string
}

export const defaultLimits = {
  duin: {
    messagesAllowed: 3,
    resetTimeInHours: 24,
  },
  scorekeeper: {
    messagesAllowed: 10,
    resetTimeInHours: 24,
  },
  self: {
    messagesAllowed: -1,
    resetTimeInHours: 24,
  },
  towncrier: {
    messagesAllowed: 3,
    resetTimeInHours: 24,
  },
} as {
  [key in (typeof defaultChatNames)[number]]: {
    messagesAllowed: number
    resetTimeInHours: number
  }
}

export const towncrierMessages = {
  'no-nft': `Looks like you haven't received an NFT yet from Duin. Duin will grant you an NFT along with test eth if you score above 80. This NFT will allow you to get any tweet reposted on Duin's twitter account once per day.`,
  'no-tweet': `I could not find a tweet to repost in your message, please try again.`,
  'no-token-id': `I could not find a token ID in your message, please try again. Your message should contain the token ID of the NFT you hold in the following format: Token ID: <tokenId> followed by your tweet link.`,
  'failed-retweet': `I failed to repost the tweet. Please try again.`,
  'success-retweet': `I successfully reposted the tweet. You can get another retweet tomorrow.`,
}