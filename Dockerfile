# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies (legacy-peer-deps for mermaid-cli/puppeteer conflict)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy built output, server wrapper, and all node_modules (Astro SSR needs some devDeps at runtime)
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server-entry.mjs ./server-entry.mjs

# Azure App Service uses PORT env var (defaults to 4321)
ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

CMD ["node", "./server-entry.mjs"]
