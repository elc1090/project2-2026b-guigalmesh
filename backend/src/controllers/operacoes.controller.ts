import { Request, Response } from "express";
import { createOperacaoSchema } from "../types/operacao";
import { createOperacao, listOperacoes, deleteOperacao } from "../services/operacoes.service";
import { getUsuarioId } from "../middleware/usuario";
import { AtivoDesconhecidoError, SaldoInsuficienteError } from "../lib/errors";

export async function postOperacao(req: Request, res: Response) {
  const parsed = createOperacaoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: { codigo: "VALIDACAO", mensagem: parsed.error.issues[0].message },
    });
  }

  try {
    const operacao = await createOperacao(getUsuarioId(req), parsed.data);
    return res.status(201).json({ data: operacao });
  } catch (erro) {
    if (erro instanceof AtivoDesconhecidoError) {
      return res.status(400).json({
        error: {
          codigo: "ATIVO_DESCONHECIDO",
          mensagem: `Ticker '${erro.ticker}' ainda não cadastrado. Informe "classe" (ACAO, FII ou RENDA_FIXA) para cadastrá-lo.`,
        },
      });
    }
    if (erro instanceof SaldoInsuficienteError) {
      return res.status(400).json({
        error: { codigo: "SALDO_INSUFICIENTE", mensagem: erro.message },
      });
    }
    console.error(erro);
    return res.status(500).json({ error: { codigo: "ERRO_INTERNO", mensagem: "Erro ao registrar operação." } });
  }
}

export async function getOperacoes(req: Request, res: Response) {
  const operacoes = await listOperacoes(getUsuarioId(req));
  return res.json({ data: operacoes });
}

export async function removerOperacao(req: Request, res: Response) {
  const operacaoId = parseInt(req.params.id, 10);

  if (isNaN(operacaoId)) {
    return res.status(400).json({ error: { codigo: "VALIDACAO", mensagem: "ID inválido" } });
  }

  try {
    await deleteOperacao(getUsuarioId(req), operacaoId);
    return res.status(204).send();
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({
      error: { codigo: "ERRO_INTERNO", mensagem: "Erro ao excluir operação." }
    });
  }
}
