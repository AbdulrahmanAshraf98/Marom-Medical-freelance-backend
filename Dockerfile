# Use the official Node.js image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install NestJS dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy built files and dependencies from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY .env ./

# Expose the application port
ARG APP_PORT=8000
ENV APP_PORT=${APP_PORT}
EXPOSE ${APP_PORT}

# Start the application
CMD ["node", "dist/main.js"]

