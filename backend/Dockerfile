FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# Production dependencies only
COPY backend/package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY backend/ .

USER node
EXPOSE 5001
CMD ["node", "src/index.js"]
