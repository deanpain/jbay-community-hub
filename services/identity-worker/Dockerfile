FROM node:20-alpine AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/identity-worker/package.json services/identity-worker/package.json

RUN corepack enable && pnpm --version && pnpm install --frozen-lockfile --filter identity-worker...

COPY services/identity-worker services/identity-worker

RUN pnpm --filter identity-worker build

CMD ["pnpm", "--filter", "identity-worker", "start"]
