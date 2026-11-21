# StockPilot AI — Backend Server Dockerfile
FROM node:20-alpine AS runner

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application code
COPY index.js seed.js ./
COPY models/ ./models/
COPY lib/ ./lib/

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "index.js"]
