# Composite Bot on Azure Functions

Example showing creation of a composite bot using the Bot Framework / botbuilder.

Using this approach it is easy to run and debug the bot locally - and it supports continous deployment to Azure Functions.

## Installation

Git clone this repo.  Then 

> npm install

> npm run build


## Notes

* Until Chris and company release the next version of Azure Functions, you will need to manually modify node_modules/azure-functions-typescript/package.json to add:

  > "typings": "src/index.d.ts",

* If you are on Windows with VSCode you probably want to modify your task runner to include:

  > windows : { "command" : ".\\node_modules\.bin\tsc" },

* To run or debug locally set the NODE_ENV variable to "development".  On Windows:

  > set NODE_ENV=development
