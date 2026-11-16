# Production Multi-Stage Dockerfile for MediCare Frontend (React + Vite + Nginx)

# Stage 1: Build the React Application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build production distribution assets
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine AS runner

# Copy custom Nginx configuration for React Router SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
