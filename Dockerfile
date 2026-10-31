# 21 — Twenty One Clothing | Production Coolify / VPS Dockerfile
FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV DB_MODE=local
ENV DATA_DIR=/app/data

# Install dependencies cleanly
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application source & preserved live seed snapshot (/app/seed_data)
COPY . .

# Ensure persistent data directory exists and is writable
RUN mkdir -p /app/data && chown -R node:node /app

USER node

EXPOSE 3000

# Native Node healthcheck for Coolify zero-downtime deployments
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 3000) + '/healthz', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
