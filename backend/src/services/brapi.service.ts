import { pool } from "../db/pool";

const BRAPI_TOKEN = process.env.BRAPI_TOKEN;
const TEMPO_CACHE_MINUTOS = 15;

export async function getCotacaoAtualizada(ativoId: number, ticker: string): Promise<number> {
  // 1. Busca o estado atual no banco de dados
  const result = await pool.query(
    `SELECT cotacao_atual, ultima_atualizacao FROM ativos WHERE id = $1`,
    [ativoId]
  );

  const ativo = result.rows[0];

  // 2. Verifica se o cache ainda é válido
  if (ativo && ativo.ultima_atualizacao) {
    const agora = new Date();
    const ultima = new Date(ativo.ultima_atualizacao);
    const diferencaMinutos = (agora.getTime() - ultima.getTime()) / (1000 * 60);

    // Se passou menos de 15 minutos e temos um valor válido, retorna direto do banco!
    if (diferencaMinutos < TEMPO_CACHE_MINUTOS && Number(ativo.cotacao_atual) > 0) {
      return Number(ativo.cotacao_atual);
    }
  }

  // 3. Se o cache expirou (ou não existe), vamos à Brapi
  if (!BRAPI_TOKEN) {
    console.warn("BRAPI_TOKEN ausente no .env. Retornando preço do cache ou zero.");
    return ativo ? Number(ativo.cotacao_atual) : 0;
  }

  try {
    const response = await fetch(`https://brapi.dev/api/quote/${ticker}?token=${BRAPI_TOKEN}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const precoReal = data.results[0].regularMarketPrice;

      // 4. Salva o novo preço no banco de dados para os próximos 15 minutos
      await pool.query(
        `UPDATE ativos SET cotacao_atual = $1, ultima_atualizacao = NOW() WHERE id = $2`,
        [precoReal, ativoId]
      );

      return precoReal;
    }
  } catch (error) {
    console.error(`Erro ao buscar cotação de ${ticker} na Brapi. Usando fallback.`);
  }

  // Fallback: se a API falhar ou o ativo não existir lá (ex: Renda Fixa), devolve o que tinha
  return ativo ? Number(ativo.cotacao_atual) : 0;
}
