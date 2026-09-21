import express from "express";
import cors from "cors";
import { pool } from "./db/pool";
import operacoesRouter from "./routes/operacoes.routes";
import carteiraRouter from "./routes/carteira.routes";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/health/db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", db_time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: "error", message: (error as Error).message });
  }
});

app.use("/api/v1/operacoes", operacoesRouter);
app.use("/api/v1/carteira", carteiraRouter);

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
