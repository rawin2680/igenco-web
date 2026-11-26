# ------------------------------------------------------------------------------
# Strapi v5 Headless CMS Dockerfile (TypeScript + PostgreSQL)
# ------------------------------------------------------------------------------

# 1. Base Stage
FROM node:20-alpine AS base
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git
WORKDIR /app

# 2. Dependencies Stage
FROM base AS dependencies
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# 3. Development Stage (used by docker-compose)
FROM base AS development
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 1337
CMD ["npm", "run", "develop"]

# 4. Production Build Stage
FROM base AS build
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 5. Production Runner Stage
FROM base AS production
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
# tsconfig.json tells `strapi start` this is a TypeScript app, so it loads the compiled code in dist/
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/config ./config
COPY --from=build /app/public ./public
RUN mkdir -p public/uploads
EXPOSE 1337
CMD ["npm", "run", "start"]
