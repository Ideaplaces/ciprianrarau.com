# syntax=docker/dockerfile:1.6
# Multi-stage build for Next.js 15 standalone output.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# npm install (not npm ci) tolerates the picomatch peer-dep dedup conflict
# between tailwind's micromatch (picomatch ^2) and tinyglobby's fdir
# (picomatch ^3 || ^4). --legacy-peer-deps mirrors the previous Astro setup.
RUN npm install --legacy-peer-deps --no-audit --no-fund

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Match the port the Azure Container App ingress already targets.
ENV PORT=4321
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Standalone server output + static assets + public/.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 4321

CMD ["node", "server.js"]
