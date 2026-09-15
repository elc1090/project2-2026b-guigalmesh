# ---------- base: dependências compartilhadas ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---------- development: hot-reload do Vite, usada pelo docker-compose.yml ----------
FROM base AS development
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# ---------- build: gera os arquivos estáticos ----------
FROM base AS build
RUN npm install
COPY . .
RUN npm run build

# ---------- production: serve os estáticos via Nginx ----------
FROM nginx:1.27-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
