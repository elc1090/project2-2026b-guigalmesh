import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Healthcheck simples: confirma que a API está de pé.
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Healthcheck do banco: confirma que a conexão com o Postgres funciona.
app.get("/health/db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", db_time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: "error", message: (error as Error).message });
  }
});

// TODO: montar aqui as rotas de /operacoes (CRUD de compra/venda de ativos)

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
