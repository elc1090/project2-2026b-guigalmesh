# ---------- base: dependências compartilhadas ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---------- development: hot-reload, usada pelo docker-compose.yml ----------
FROM base AS development
ENV NODE_ENV=development
RUN npm install
COPY . .
EXPOSE 3333
CMD ["npm", "run", "dev"]

# ---------- build: compila TypeScript -> JavaScript ----------
FROM base AS build
ENV NODE_ENV=production
RUN npm install
COPY . .
RUN npm run build

# ---------- production: imagem final, enxuta, sem devDependencies ----------
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3333
CMD ["node", "dist/server.js"]
