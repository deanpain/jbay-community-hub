# syntax=docker/dockerfile:1
# API BFF — multi-stage build (pnpm monorepo)

# ---- Build stage ----
FROM node:24-slim AS build
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace root configs
COPY pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json package.json ./

# Copy service-specific package files
COPY services/api/package.json services/api/
COPY services/api/tsconfig*.json services/api/

# Install dependencies (frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile --filter api...

# Copy service source
COPY services/api/src/ services/api/src/

# Build
RUN pnpm --filter api run build

# ---- Production stage ----
FROM node:24-slim AS production
WORKDIR /app

# Copy built artifacts and production deps
COPY --from=build /app/services/api/dist ./dist
COPY --from=build /app/services/api/node_modules ./node_modules
COPY --from=build /app/node_modules ./node_modules

# Non-root user
USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3001/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "--enable-source-maps", "dist/server.js"]
