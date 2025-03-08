import { createIngredients, checkIfIngredientsExist } from './services/ingredients'

interface AddIngredientsRequest {
  ingredients: string[]
}

interface LambdaResponse {
  error: string | null
  jsonResult: any
}

export const handler = async (event: any): Promise<LambdaResponse> => {
  try {
    const {
      ingredients,
    } = event as AddIngredientsRequest

    if (
      !ingredients ||
      ingredients.length === 0 ||
      !Array.isArray(ingredients)
    ) {
      throw new Error('Ingredients are required')
    }

    let ingredientsCreated = []
    const missingIngredients = await checkIfIngredientsExist(ingredients)
    if (missingIngredients.length > 0) {
      await createIngredients(missingIngredients)
      ingredientsCreated.push(missingIngredients)
    }

    const result = {
      success: true,
      message: 'Ingredients added',
      ingredientsCreated,
    }

    return {
      error: null,
      jsonResult: result,
    }
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : 'Unknown error',
      jsonResult: null,
    }
  }
}

(async () => {
  const result = await handler({
    ingredients: ['tomatoes'],
  })
  
  console.log(result)
})()