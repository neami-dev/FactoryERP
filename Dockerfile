# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder  next.config.mjs ./next.config.mjs
COPY --from=builder  public ./public
COPY --from=builder  ./.next ./.next
COPY --from=builder  ./node_modules ./node_modules
COPY --from=builder  ./package.json ./package.json

CMD ["npm", "start"]