# Production Dockerfile for MediCare Backend (Node.js/Express)
FROM node:20-alpine AS runner

# Create non-root system user for cloud container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Set container permissions to non-root user
USER appuser

# Expose port (default 5000, configurable via PORT environment variable in Azure)
EXPOSE 5000

# Start MediCare backend
CMD ["node", "server.js"]
