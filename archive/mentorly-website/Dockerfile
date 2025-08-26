# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build arguments
ARG NEXT_PUBLIC_API_URL=https://api.mentorly.com
ARG NEXT_PUBLIC_BASE_URL=https://mentorly.com
ARG NEXT_PUBLIC_COOKIE_DOMAIN=mentorly.com
ARG NEXT_PUBLIC_TOKEN_NAME=token
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
ARG NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-WWKPDF9
ARG NEXT_PUBLIC_STRIPE_PK=pk_test_mUmFRbO3WjUiHJGGLFXPwW5z

# Set environment variables
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_PUBLIC_COOKIE_DOMAIN=$NEXT_PUBLIC_COOKIE_DOMAIN \
    NEXT_PUBLIC_TOKEN_NAME=$NEXT_PUBLIC_TOKEN_NAME \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=$NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID \
    NEXT_PUBLIC_STRIPE_PK=$NEXT_PUBLIC_STRIPE_PK \
    NODE_ENV=production

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
