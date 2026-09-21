import { Request, Response } from "express";
import { getPosicoesCarteira } from "../services/carteira.service";
import { getUsuarioId } from "../middleware/usuario";
import { classeParaLabel } from "../lib/classeAtivo";
import { getCotacaoAtualizada } from "../services/brapi.service"; // <-- IMPORT NOVO

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
