FROM docker:cli AS docker-cli

FROM oven/bun:latest AS base
WORKDIR /app

# Install curl and ca-certificates for health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*

# Install static docker CLI binary from official docker:cli image
COPY --from=docker-cli /usr/local/bin/docker /usr/local/bin/docker

FROM base AS dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json bun.lockb ./
COPY tsconfig.json ./
COPY src ./src

EXPOSE 5000

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["bun", "run", "src/index.ts"]
