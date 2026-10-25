# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S cirvia && adduser -S cirvia -u 1001 -G cirvia

COPY --from=builder /app/public ./public
COPY --from=builder --chown=cirvia:cirvia /app/.next/standalone ./
COPY --from=builder --chown=cirvia:cirvia /app/.next/static ./.next/static

USER cirvia

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3002/ || exit 1

CMD ["node", "server.js"]
