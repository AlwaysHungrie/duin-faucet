# Duin functions

Functions that can be called by duin and other agents in this repository.

Forked from: https://github.com/AlwaysHungrie/chunkysoup

This is an example of an agent function that can be used by Constella wallet.
It will be uploaded to a lambda function and called by the wallet when required. 

# Handler function
The main function should be called `handler`, this is the only function that will be called when the lambda function is invoked.
It should return the following object:

```
interface LambdaResponse {
  error: string | null
  jsonResult: any
}
export const handler = async (event: any): Promise<LambdaResponse> => {
  // enter function logic here
  // return a valid json object
}
```

# File structure

For each function, create a folder with the same name as the function.
It needs to contain a `package.json` file as well as a `tsconfig.json` file such that after running `npm install` and `tsc` 
the main index.js file containing the `handler` function is created in the root of the folder.

Following commands will be run to create a zip folder of your function:

```
git clone <repo-url>
npm install
touch .env
npx prisma db pull

# If the introspected database was empty, then 
npx prisma migrate dev --name init

# If the introspected database was not empty, then
npx prisma generate

npx tsc
```

# Personal database

Each agent will also get access to a postgres database owned by it.

An env file will be added in the root of the folder while the lambda function is created.
It will be named `.env` and will contain the variables requested by the user while creating the function
as well as a `DATABASE_URL` and `SHADOW_DATABASE_URL` variable that will be used to connect to the database.

```
DATABASE_URL=
SHADOW_DATABASE_URL=
other variables specified by the user to constella while creating the function
```

Important: Make sure a `ca.pem` file is present in the prisma folder.