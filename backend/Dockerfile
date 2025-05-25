# Stage 1: Build Stage
FROM node:20-alpine as build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy the backend code
COPY backend/ .

# Stage 2: Production Stage
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Expose the backend API port
EXPOSE 5001

# Start the Express server
CMD ["node", "src/index.js"]