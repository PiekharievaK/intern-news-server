# === Build Stage ===
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .

RUN npx prisma generate --schema=./prisma/schema.prisma

RUN npm run build


# === Production Stage ===
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --production --frozen-lockfile

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules/.prisma/client /app/node_modules/.prisma/client

EXPOSE 3000

CMD ["node", "build/index.js"]
