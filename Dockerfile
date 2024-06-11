ARG NODE_VERSION=22.2.0
ARG PNPM_VERSION=9.3.0

FROM node:${NODE_VERSION}-alpine

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm install

COPY prisma ./prisma

RUN pnpx prisma generate

COPY . .

EXPOSE 9000

CMD ["node", "dist/src/index.js"]
