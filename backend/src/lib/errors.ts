export class AtivoDesconhecidoError extends Error {
  constructor(public ticker: string) {
    super(`Ativo '${ticker}' não cadastrado`);
  }
}

export class SaldoInsuficienteError extends Error {
  constructor(public ativoId: number, public quantidadeSolicitada: number, public quantidadeDisponivel: number) {
    super(`Venda de ${quantidadeSolicitada} maior que a posição atual de ${quantidadeDisponivel}`);
  }
}

export class TickerInvalidoError extends Error {
  constructor(public ticker: string) {
    super(`O ticker '${ticker}' não foi encontrado na B3.`);
  }
}
