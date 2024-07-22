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

# Set environment variables (use default values if needed)
ARG APP_PORT=8000
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_DATABASE
ARG DB_TYPE
ARG DB_DATABASE_SYNCHRONIZE
ENV APP_PORT=${APP_PORT}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_DATABASE=${DB_DATABASE}
ENV DB_TYPE=${DB_TYPE}
ENV DB_DATABASE_SYNCHRONIZE=${DB_DATABASE_SYNCHRONIZE}
# Expose the application port
EXPOSE ${APP_PORT}

# Start the application
CMD ["node", "dist/main.js"]
