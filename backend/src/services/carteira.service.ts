import { pool } from "../db/pool";

export async function getPosicoesCarteira(usuarioId: string) {
  const resultado = await pool.query(
    `SELECT
       a.id AS ativo_id,
       a.ticker_base AS ticker,
       a.classe AS tipo,
       pc.quantidade,
       pc.preco_medio
     FROM posicoes_carteira pc
     JOIN ativos a ON a.id = pc.ativo_id
     WHERE pc.usuario_id = $1 AND pc.quantidade > 0
     ORDER BY pc.quantidade DESC`,
    [usuarioId]
  );

  return resultado.rows;
}
