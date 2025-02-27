import config from '../config'
import { exec } from 'child_process'

const {
  RUST_BINARY_PATH,
  OPENAI_API_KEY,
  NOTARY_HOST,
  NOTARY_PORT,
  NOTARY_TLS,
} = config

export interface ExecuteRequestBody {
  apiKey: string
  llmRequest: Record<string, any>
  userDir: string
  outputPrefix: string
  url: string
}

// Helper functions
const executeRustCommand = (command: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Rust program: ${error}`)
        reject(new Error(`Failed to execute Rust program: ${error.message}`))
        return
      }

      try {
        const parsedOutput = JSON.parse(stdout.trim())
        resolve(parsedOutput)
      } catch (parseError) {
        console.error(`Error parsing Rust output: ${parseError}`)
        reject(new Error('Failed to parse Rust program output'))
      }
    })
  })
}

const sanitizeJsonString = (jsonString: string): string => {
  if (!jsonString) {
    return ''
  }

  // base64 encode the json string
  const base64Encoded = Buffer.from(jsonString).toString('base64')
  return base64Encoded
}

const buildRustCommand = (
  url: string,
  headers: Record<string, string>,
  requestJson: Record<string, any>,
  userDir: string,
  outputPrefix: string,
  privateWords: string
): string => {
  return (
    [
      RUST_BINARY_PATH,
      '--url',
      `'${url}'`,
      '--headers',
      `'${JSON.stringify(headers)}'`,
      '--request-json',
      `'${sanitizeJsonString(JSON.stringify(requestJson))}'`,
      '--user-dir',
      userDir,
      '--output-prefix',
      outputPrefix,
      '--max-sent-data',
      '16384',
      '--max-recv-data',
      '16384',
      '--notary-host',
      NOTARY_HOST,
      '--notary-port',
      NOTARY_PORT.toString(),
      '--private-words',
      privateWords,
    ].join(' ') + (NOTARY_TLS ? ' --notary-tls' : '')
  )
}

export const executeLLM = async (requestBody: ExecuteRequestBody) => {
  try {
    const { url, apiKey, llmRequest, userDir, outputPrefix } = requestBody
    console.log('requestBody', requestBody)

    if (!apiKey || !llmRequest || !url || !userDir || !outputPrefix) {
      throw new Error(
        'Missing required parameters: apiKey, llmRequest, url, userDir, and outputPrefix are required'
      )
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }
    const command = buildRustCommand(
      url,
      headers,
      llmRequest,
      userDir,
      outputPrefix,
      `${OPENAI_API_KEY}`
    )

    console.log('command', command)

    const result = await executeRustCommand(command)
    console.log('llm result', result)
    return result
  } catch (err) {
    console.error(`Server error: ${err}`)
    if (err instanceof Error) {
      throw new Error('Error executing LLM: ' + err.message)
    } else {
      throw new Error('Error executing LLM: ' + JSON.stringify(err))
    }
  }
}
