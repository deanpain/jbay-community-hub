FROM node:20-alpine AS base

WORKDIR /app

# Copy workspace config and root package.json
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy identity-worker source
COPY services/identity-worker /app/services/identity-worker

# Enable corepack and install dependencies
RUN corepack enable && pnpm install --frozen-lockfile

# Build the identity-worker
RUN pnpm --filter identity-worker build

# Expose health check port
EXPOSE 3000

CMD ["node", "services/identity-worker/dist/start-worker.js"]
