# === Build Stage ===
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json /mongo-init/init.js ./
RUN npm install --frozen-lockfile

COPY . .

RUN npx prisma generate --schema=./src/prisma/schema.prisma
RUN npm run build


# === Production Stage ===
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --production --frozen-lockfile

COPY --from=builder /app/build ./build
COPY --from=builder /app/src/prisma/generated ./src/prisma/generated

EXPOSE 3000

CMD ["node", "build/index.js"]
