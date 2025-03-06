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
    "Yap, yap, yap. Did Duin send like your idea so much that he granted you an NFT along with test tokens? I can yap about your project from Duin's twitter account. Just share the link of your tweet that you would like for me to repost, once per day.",
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
    messagesAllowed: 10,
    resetTimeInHours: 24,
  },
} as {
  [key in (typeof defaultChatNames)[number]]: {
    messagesAllowed: number
    resetTimeInHours: number
  }
}
