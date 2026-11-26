# Stage 1: Build Stage
FROM node:20-alpine as build

# Define build arguments for environment variables
ARG VITE_PAYPAL_CLIENT_ID
ARG VITE_API_URL=http://localhost:5001
ARG VITE_SOCKET_URL
# Vite bakes these into the bundle at build time
ENV VITE_PAYPAL_CLIENT_ID=$VITE_PAYPAL_CLIENT_ID \
    VITE_API_URL=$VITE_API_URL \
    VITE_SOCKET_URL=$VITE_SOCKET_URL

# Set the working directory
WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY frontend/ .

# Build the Vite app for production
RUN npm run build

# Stage 2: Production Stage
FROM nginx:alpine

# Copy the build artifacts from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx is running on
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]