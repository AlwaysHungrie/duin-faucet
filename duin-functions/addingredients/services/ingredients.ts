import prisma from '../prismaClient'

export const getSortedIngredientsList = async (ingredients: string[]) => {
  const sortedIngredients = ingredients.sort()
  return sortedIngredients.join(', ')
}

export const createIngredients = async (ingredients: string[]) => {
  const createdIngredients = await prisma.ingredient.createMany({
    data: ingredients.map((ingredient) => ({ name: ingredient })),
  })
  return createdIngredients
}

export const checkIfIngredientsExist = async (ingredients: string[]) => {
  console.log('finding ingredients', ingredients)
  const ingredientsFromDb = await prisma.ingredient.findMany({
    where: {
      name: {
        in: ingredients,
      },
    },
  })
  console.log('ingredientsFromDb', ingredientsFromDb)
  const ingredientsFound = new Set(ingredientsFromDb.map((ingredient) => ingredient.name))
  console.log('ingredientsFound', ingredientsFound)
  const missingIngredients = ingredients.filter((ingredient) => !ingredientsFound.has(ingredient))
  console.log('missingIngredients', missingIngredients)
  return missingIngredients
}
