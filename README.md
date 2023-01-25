# Quizzes

[![CircleCI](https://circleci.com/gh/rage/quizzes/tree/master.svg?style=svg)](https://circleci.com/gh/rage/quizzes/tree/master)

## Setup locally
You can set up you shell to automatically switch node version between folders. [Instructions](https://github.com/nvm-sh/nvm#deeper-shell-integration).

To run locally

At the project root

```bash
nvm use
npm ci
```

To start the server:
```bash
cd packages/backend
nvm use
npm ci
npm run build
npm start
```

To start the server (V2):
```bash
cd packages/backendv2
nvm use
npm ci
npm run dev
```

To start the dashboard:

```bash
cd packages/dashboard
nvm use
npm ci
npm start
```

To load widget in playground:
```bash
cd packages/moocfi-quizzes
nvm use
npm ci
cd example
npm ci
npm start
```


## Setup with docker compose

Setup the project locally by running the command:

```bash
docker-compose up -d
```

To setup the database run the command:
```
./bin/setup-database.sh
```

Visit example project at http://localhost:1234 and dashboard at http://localhost:5000