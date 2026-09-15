# project2-2026b-guigalmesh

Scaffold inicial (backend Express + TypeScript, frontend React + Vite + TypeScript,
banco PostgreSQL), pronto para rodar em Docker tanto em desenvolvimento quanto em produção.

## Como rodar em desenvolvimento

1. Copie o arquivo de variáveis de ambiente e preencha os valores:

   ```bash
   cp .env.example .env
   ```

2. Suba tudo com hot-reload (o compose já usa o alvo `development` dos Dockerfiles):

   ```bash
   docker compose up --build
   ```

3. Acesse:
   - Backend: http://localhost:3333/health e http://localhost:3333/health/db
   - Frontend: http://localhost:5173
   - Postgres: localhost:5432 (usuário/senha definidos no `.env`)

Qualquer alteração em `backend/src` ou `frontend/src` recarrega automaticamente,
porque as pastas estão montadas como volume dentro dos containers.

## Como rodar como se fosse produção (localmente)

Usa o alvo `production` dos Dockerfiles (build otimizado do backend + frontend
servido via Nginx, sem volumes de hot-reload):

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

Frontend fica em http://localhost (porta 80) e o backend em http://localhost:3333.

## Por que multi-stage no Dockerfile?

Cada Dockerfile (backend e frontend) tem 3 estágios: `development` (hot-reload,
usado no dia a dia), `build` (compila TS -> JS / gera os estáticos) e `production`
(imagem final enxuta, sem devDependencies nem código-fonte, só o necessário para
rodar). Isso evita ter um Dockerfile "de desenvolvimento" e outro "de produção"
completamente separados e mantidos à mão.
