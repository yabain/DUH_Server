# DoUHaveProject

## Installation steps to run locally (development)

### Server - API
1. Open a terminal
2. git clone the project from the git clone link( Command : git clone https://github.com/Kaytee12385/DoUHaveProject)
3. Go into project directory.
4. Run `npm install`
5. Be sure to set the env vars by creating the .env file from the .env.sample one
6. Run `nodemon server.js` to start the server

### Client - UI
1. Open a new terminal
2. Go into the project directory and into client folder
3. Install the dependencies by running `npm install`
4. Let's define the env vars for dev and prod by tweaking the files .env.development and .env.production
5. The start the client `npm start`

## Lambda Env Variables:

- **dev.json** is use for development.

- **prod.json** is use for production.

- Both files are created from **env.json** and are fetched/uploaded using the commands: set-vars:env & get-vars:env

## Caching using Redis
The caching database is a Redis server hosted at **UpStash (Lambda Store)**, and we use prefix to differenciate the dev from the prod keys.

## SEO metadata fetching
This project uses [chrome-aws-lambda](https://github.com/DoUHave/chrome-aws-lambda) as layer to use deadless chrome via puppeteer on Lambda, while running the project locally it uses the normal puppeteer installed as dev dependencies so it's not compiled for prod.

## Cloud Function Deployment
If deployed with ClaudiaJS we need to update the env var over there after the first deployment then deploying again.

1) Create the lambda: `npm run create`.
2) Define the env var for the lambda function (dev.json & prod.json).
3) Deploying/updating the App (claudia update):
    - `npm run deploy:dev` - Deploying the dev version.
    - `npm run deploy:prod` - Deploying the prod version.
4) Run appropriate job-scheduler scripts to enable cron for Lambda: `npm run job:xxxxxx:xxx`
We need to deploy as many warmer as needed so that we have many lambda concurrent executions, meaning calling this script X times `npm run job:warm:xxx` per env.
6) Destroying: claudia destroy.
