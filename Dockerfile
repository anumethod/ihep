# Minimal SSR placeholder using Node.js
FROM node:24-alpine

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY server.js ./

ENV PORT=8080 NODE_ENV=production
EXPOSE 8080

CMD ["node", "server.js"]

