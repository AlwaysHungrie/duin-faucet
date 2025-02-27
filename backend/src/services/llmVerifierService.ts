import config from '../config'
import { exec } from 'child_process'

const { RUST_VERIFIER_BINARY_PATH, BACKEND_URL } = config

export interface ExecuteVerifierRequestBody {
  fileKey: string
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

const buildRustCommand = (fileKey: string, agentHost: string): string => {
  return [
    RUST_VERIFIER_BINARY_PATH,
    '--file-key',
    `'${fileKey}'`,
    '--agent-host',
    `'${agentHost}'`,
  ].join(' ')
}

export const executeVerifier = async (
  requestBody: ExecuteVerifierRequestBody
) => {
  try {
    const { fileKey } = requestBody
    console.log('requestBody', requestBody)

    if (!fileKey) {
      throw new Error('Missing required parameters: fileKey is required')
    }

    const command = buildRustCommand(fileKey, BACKEND_URL)
    const result = await executeRustCommand(command)
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
