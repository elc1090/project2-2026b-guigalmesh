import { Request, Response } from "express";
import { getPosicoesCarteira } from "../services/carteira.service";
import { getUsuarioId } from "../middleware/usuario";
import { classeParaLabel } from "../lib/classeAtivo";
import { getCotacaoAtualizada } from "../services/brapi.service";
import { pool } from "../db/pool";
import { popularCacheHistorico } from "../services/brapi.service";

export async function getCarteira(req: Request, res: Response) {
  try {
    const posicoes = await getPosicoesCarteira(getUsuarioId(req));

    // Promise.all permite buscar as cotações de todos os ativos ao mesmo tempo
    const ativosFormatados = await Promise.all(posicoes.map(async (pos) => {
      const quantidade = Number(pos.quantidade);
      const precoMedio = Number(pos.preco_medio);

      const cotacaoAtual = await getCotacaoAtualizada(pos.ativo_id, pos.ticker);

      const rentabilidade = precoMedio > 0
        ? ((cotacaoAtual / precoMedio) - 1) * 100
        : 0;

      return {
        ticker: pos.ticker,
        tipo: classeParaLabel(pos.tipo),
        quantidade: quantidade,
        precoMedio: precoMedio,
        cotacaoAtual: cotacaoAtual,
        rentabilidade: rentabilidade
      };
    }));

    return res.json({ data: ativosFormatados });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({
      error: { codigo: "ERRO_INTERNO", mensagem: "Erro ao buscar posições da carteira." }
    });
  }
}

export async function getEvolucaoPatrimonial(req: Request, res: Response) {
  const usuarioId = getUsuarioId(req);

  try {
    const ativosResult = await pool.query(
      `SELECT DISTINCT o.ativo_id, a.ticker_base
       FROM operacoes o
       JOIN ativos a ON a.id = o.ativo_id
       WHERE o.usuario_id = $1`,
      [usuarioId]
    );

    // 2. Alimenta o banco com o histórico da Brapi (em paralelo para ser rápido)
    await Promise.all(ativosResult.rows.map(a =>
      popularCacheHistorico(a.ativo_id, a.ticker_base)
    ));

    // 3. Gera a lista dos últimos 6 meses
    const meses = [];
    const hoje = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      meses.push({
        label: d.toLocaleString('pt-BR', { month: 'short' }).replace('.', ''), // ex: 'set'
        ano: d.getFullYear(),
        mes: d.getMonth() + 1 // 1 a 12
      });
    }

    const graficoData = [];

    // 4. Calcula o património mês a mês
    for (const m of meses) {
      // Pega o último milissegundo do último dia do mês (ex: 30 de Set às 23:59:59)
      const ultimoDia = new Date(m.ano, m.mes, 0, 23, 59, 59).toISOString();

      const query = await pool.query(`
        WITH PosicaoNaData AS (
          SELECT ativo_id, SUM(CASE WHEN tipo = 'COMPRA' THEN quantidade ELSE -quantidade END) as qtd_acumulada
          FROM operacoes
          WHERE usuario_id = $1 AND data_operacao <= $2
          GROUP BY ativo_id
        ),
        PrecoNoMes AS (
          SELECT DISTINCT ON (ativo_id) ativo_id, preco_fechamento
          FROM historico_cotacoes
          WHERE EXTRACT(MONTH FROM data_referencia) = $3 AND EXTRACT(YEAR FROM data_referencia) = $4
          ORDER BY ativo_id, data_referencia DESC
        )
        SELECT p.qtd_acumulada, c.preco_fechamento
        FROM PosicaoNaData p
        JOIN PrecoNoMes c ON c.ativo_id = p.ativo_id
        WHERE p.qtd_acumulada > 0
      `, [usuarioId, ultimoDia, m.mes, m.ano]);

      let patrimonioDoMes = 0;
      for (const row of query.rows) {
         patrimonioDoMes += Number(row.qtd_acumulada) * Number(row.preco_fechamento);
      }

      graficoData.push({
        mes: m.label.charAt(0).toUpperCase() + m.label.slice(1), // Capitaliza (mar -> Mar)
        patrimonio: patrimonioDoMes
      });
    }

    return res.json({ data: graficoData });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ error: { codigo: "ERRO_INTERNO", mensagem: "Erro ao gerar gráfico" }});
  }
}
