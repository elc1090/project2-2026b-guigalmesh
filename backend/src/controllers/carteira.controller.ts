import { Request, Response } from "express";
import { getPosicoesCarteira } from "../services/carteira.service";
import { getUsuarioId } from "../middleware/usuario";
import { classeParaLabel } from "../lib/classeAtivo";

export async function getCarteira(req: Request, res: Response) {
  try {
    const posicoes = await getPosicoesCarteira(getUsuarioId(req));

    const ativosFormatados = posicoes.map((pos) => {
      const quantidade = Number(pos.quantidade);
      const precoMedio = Number(pos.preco_medio);

      // MOCK: Simula uma cotação atual oscilando entre -5% e +15% do preço médio
      const variacaoMock = 1 + (Math.random() * 0.20 - 0.05);
      const cotacaoAtual = precoMedio * variacaoMock;

      const rentabilidade = ((cotacaoAtual / precoMedio) - 1) * 100;

      return {
        ticker: pos.ticker,
        tipo: classeParaLabel(pos.tipo),
        quantidade: quantidade,
        precoMedio: precoMedio,
        cotacaoAtual: cotacaoAtual,
        rentabilidade: rentabilidade
      };
    });

    return res.json({ data: ativosFormatados });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({
      error: { codigo: "ERRO_INTERNO", mensagem: "Erro ao buscar posições da carteira." }
    });
  }
}
