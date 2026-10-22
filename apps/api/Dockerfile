# ==============================================================================
# Multi-Stage Production Dockerfile for NestJS API
# ==============================================================================

# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including dev dependencies for build
RUN npm ci

# Copy source code and config
COPY tsconfig*.json nest-cli.json ./
COPY src ./src/

# Generate Prisma Client & compile TypeScript
RUN npx prisma generate
RUN npm run build

# Prune dev dependencies for production
RUN npm prune --production

# ------------------------------------------------------------------------------
# Stage 2: Production runner stage
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=4000

# Install runtime dependencies for health checks
RUN apk add --no-cache curl

# Create non-root system user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy build artifacts and dependencies from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./

# Set ownership to non-root user
RUN chown -R appuser:appgroup /usr/src/app

USER appuser

EXPOSE 4000

# Health check probing the live API
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4000/api/v1/dashboard/admin/health || exit 1

CMD ["node", "dist/main.js"]
