# Quizzes

[![CircleCI](https://circleci.com/gh/rage/quizzes/tree/master.svg?style=svg)](https://circleci.com/gh/rage/quizzes/tree/master)

## Setup locally
Node.js and pnpm versions are pinned in `package.json` (`devEngines.runtime`, `packageManager`). The Nix flake provides both: run `nix develop` (or let direnv load `.envrc`).

Run `pnpm install` in the repository root to install dependencies for `packages/backendv2` and `packages/quizzes-dashboard`.

To start the server:
```bash
cd packages/backendv2
pnpm run dev
```

To start the dashboard:
```bash
cd packages/quizzes-dashboard
pnpm run dev
```

Run `pnpm run format` and `pnpm run lint` in the root directory before committing.

To load widget in playground:
```bash
cd packages/moocfi-quizzes
nvm use 12
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