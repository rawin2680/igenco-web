# ------------------------------------------------------------------------------
# Nuxt 3 Multi-Stage Dockerfile (TypeScript + Node.js 20/22)
# ------------------------------------------------------------------------------

# 1. Base Stage
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# 2. Dependencies Stage
FROM base AS dependencies
COPY package.json package-lock.json* ./
RUN npm install

# 3. Development Stage (used by docker-compose in local dev)
FROM base AS development
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# 4. Build Stage
FROM base AS build
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 5. Production Runner Stage (Nitro engine output)
FROM base AS production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
