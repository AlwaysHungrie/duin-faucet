import { OpenAI } from 'openai'
import { config } from '../config'

const { OPENAI_API_KEY } = config

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

const getPrompt = async (ingredients: string[]) => {
  const prompt = `A high quality pixel art of a steaming bowl of soup made from only visible chunks of ${ingredients.join(
    ', '
  )} in plain chineese style bowl and only two or three pieces of cut ingredients in the side the bowl, off white background, soft shadows`
  return prompt
}

export const generateImage = async (ingredients: string[]) => {
  console.log('Generating image')
  const prompt = await getPrompt(ingredients)
  console.log('Prompt:', prompt)
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  return response.data[0].url
}