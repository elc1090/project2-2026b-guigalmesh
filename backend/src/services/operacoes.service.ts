import { PoolClient } from "pg";
import { pool } from "../db/pool";
import { normalizeTicker } from "../lib/ticker";
import { AtivoDesconhecidoError, SaldoInsuficienteError } from "../lib/errors";
import { CreateOperacaoInput } from "../types/operacao";

async function findOrCreateAtivo(client: PoolClient, tickerBase: string, classe?: string) {
  const existente = await client.query(
    "SELECT id, classe FROM ativos WHERE ticker_base = $1",
    [tickerBase]
  );
  if (existente.rows[0]) return existente.rows[0];

  if (!classe) throw new AtivoDesconhecidoError(tickerBase);

  const criado = await client.query(
    "INSERT INTO ativos (ticker_base, classe) VALUES ($1, $2) RETURNING id, classe",
    [tickerBase, classe]
  );
  return criado.rows[0];
}

async function aplicarOperacaoNaPosicao(
  client: PoolClient,
  usuarioId: string,
  ativoId: number,
  input: CreateOperacaoInput
) {
  // FOR UPDATE: trava a linha para evitar corrida se duas operações do mesmo
  // ativo chegarem ao mesmo tempo (ex.: dois cliques rápidos no formulário)
  const posicao = await client.query(
    `SELECT quantidade, preco_medio FROM posicoes_carteira
     WHERE usuario_id = $1 AND ativo_id = $2 FOR UPDATE`,
    [usuarioId, ativoId]
  );
  const atual = posicao.rows[0] ?? { quantidade: 0, preco_medio: 0 };
  const quantidadeAtual = Number(atual.quantidade);
  const precoMedioAtual = Number(atual.preco_medio);

  let novaQuantidade: number;
  let novoPrecoMedio: number;

  if (input.tipo === "COMPRA") {
    const custoTotalAnterior = quantidadeAtual * precoMedioAtual;
    const custoTotalDaCompra = input.quantidade * input.preco + input.custos;
    novaQuantidade = quantidadeAtual + input.quantidade;
    novoPrecoMedio = (custoTotalAnterior + custoTotalDaCompra) / novaQuantidade;
  } else {
    if (input.quantidade > quantidadeAtual) {
      throw new SaldoInsuficienteError(ativoId, input.quantidade, quantidadeAtual);
    }
    novaQuantidade = quantidadeAtual - input.quantidade;
    // venda não muda o preço médio do que sobrou; só zera se a posição zerou
    novoPrecoMedio = novaQuantidade === 0 ? 0 : precoMedioAtual;
  }

  await client.query(
    `INSERT INTO posicoes_carteira (usuario_id, ativo_id, quantidade, preco_medio)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (usuario_id, ativo_id)
     DO UPDATE SET quantidade = $3, preco_medio = $4`,
    [usuarioId, ativoId, novaQuantidade, novoPrecoMedio]
  );
}

export async function createOperacao(usuarioId: string, input: CreateOperacaoInput) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const tickerNormalizado = normalizeTicker(input.ticker);
    const ativo = await findOrCreateAtivo(client, tickerNormalizado, input.classe);

    const resultado = await client.query(
      `INSERT INTO operacoes (usuario_id, ativo_id, tipo, quantidade, preco_unitario, custos, data_operacao)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, tipo, quantidade, preco_unitario, custos, data_operacao`,
      [usuarioId, ativo.id, input.tipo, input.quantidade, input.preco, input.custos, input.data]
    );

    await aplicarOperacaoNaPosicao(client, usuarioId, ativo.id, input);

    await client.query("COMMIT");
    return resultado.rows[0];
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}

export async function listOperacoes(usuarioId: string) {
  const resultado = await pool.query(
    `SELECT o.id, a.ticker_base AS ticker, o.tipo, o.quantidade,
            o.preco_unitario, o.custos, o.data_operacao
     FROM operacoes o
     JOIN ativos a ON a.id = o.ativo_id
     WHERE o.usuario_id = $1
     ORDER BY o.data_operacao DESC`,
    [usuarioId]
  );
  return resultado.rows;
}

export async function deleteOperacao(usuarioId: string, operacaoId: number) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Descobre qual é o ativo desta operação antes de apagá-la
    const opQuery = await client.query(
      "SELECT ativo_id FROM operacoes WHERE id = $1 AND usuario_id = $2 FOR UPDATE",
      [operacaoId, usuarioId]
    );

    if (opQuery.rows.length === 0) {
      throw new Error("Operação não encontrada ou não pertence ao usuário.");
    }

    const ativoId = opQuery.rows[0].ativo_id;

    // 2. Apaga a operação
    await client.query("DELETE FROM operacoes WHERE id = $1", [operacaoId]);

    // 3. Puxa todas as operações restantes deste ativo para reconstruir o PM
    const restantes = await client.query(
      `SELECT tipo, quantidade, preco_unitario, custos
       FROM operacoes
       WHERE usuario_id = $1 AND ativo_id = $2
       ORDER BY data_operacao ASC, id ASC`,
      [usuarioId, ativoId]
    );

    let novaQuantidade = 0;
    let novoPrecoMedio = 0;

    // 4. Reconstrói a posição cronologicamente
    for (const op of restantes.rows) {
      const qtd = Number(op.quantidade);
      const preco = Number(op.preco_unitario);
      const custos = Number(op.custos);

      if (op.tipo === 'COMPRA') {
        const custoTotalAnterior = novaQuantidade * novoPrecoMedio;
        const custoTotalDaCompra = (qtd * preco) + custos;
        novaQuantidade += qtd;
        novoPrecoMedio = (custoTotalAnterior + custoTotalDaCompra) / novaQuantidade;
      } else {
        novaQuantidade -= qtd;
        novoPrecoMedio = novaQuantidade === 0 ? 0 : novoPrecoMedio;
      }
    }

    // 5. Atualiza a carteira ou remove o ativo se a quantidade zerar e não houver mais histórico
    if (restantes.rows.length === 0) {
      await client.query(
        "DELETE FROM posicoes_carteira WHERE usuario_id = $1 AND ativo_id = $2",
        [usuarioId, ativoId]
      );
    } else {
      await client.query(
        `UPDATE posicoes_carteira
         SET quantidade = $1, preco_medio = $2
         WHERE usuario_id = $3 AND ativo_id = $4`,
        [novaQuantidade, novoPrecoMedio, usuarioId, ativoId]
      );
    }

    await client.query("COMMIT");
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}
