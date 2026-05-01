# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built assets from build stage
COPY --from=build /app/dist ./dist
# Copy server source
COPY server ./server

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# The Cloud Run service account will handle auth automatically!
CMD ["node", "server/index.js"]
