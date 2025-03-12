export function extractAttestationUrls(inputString: string): string[] {
  const regex = /Attestation:\s+(https?:\/\/[^\s]+)/g
const urls = [];
  
  // Find all matches in the input string
  let match;
  while ((match = regex.exec(inputString)) !== null) {
    // The captured URL is in the first capturing group (index 1)
    urls.push(match[1]);
  }
  
  return urls;
}

const parseIfJson = (str: string) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return null
  }
}

function extractJsonRequest(sent: string) {
  const sentLines = sent.split('\r\n')
  const jsonRequest = sentLines.find((line) => parseIfJson(line))

  if (!jsonRequest) {
    return null
  }

  return jsonRequest
}

export function checkIfSystemPromptInRequest(request: string, systemPrompt: string) {
  const jsonRequest = extractJsonRequest(request)

  if (!jsonRequest) {
    return false
  }
  
  const sent = JSON.parse(jsonRequest)
  const message = sent.messages && sent.messages.length > 0 ? sent.messages[0] : null

  if (!message) {
    return false
  }

  const content = message.content

  if (!content) {
    return false
  }
  
  return content === systemPrompt
}

export const extractMessageFromRecv = (response: string) => {
  const recv = response.substring(
    response.indexOf('{'),
    response.lastIndexOf('}') + 1
  )
  const recvJson = recv
    .split('\r\n')
    .filter((_, i) => {
      return i % 2 === 0
    })
    .join('')
  const jsonResponse = parseIfJson(recvJson)

  if (!jsonResponse) {
    return null
  }

  const choice = jsonResponse.choices[0]

  if (!choice) {
    return null
  }

  const message = choice.message

  if (!message) {
    return null
  }

  return message.content
}

// https://x.com/Always_Hungrie_/status/1897558819405807745
export const extractTweetFromMessage = (message: string) => {
  const regex = /https:\/\/x\.com\/[^\s]+/g
  const match = message.match(regex)
  return match ? match[0] : null
}

export const extractTokenIdFromMessage = (message: string) => {
  const regex = /Token ID: (\d+)/
  const match = message.match(regex)
  return match ? parseInt(match[1]) : null
}