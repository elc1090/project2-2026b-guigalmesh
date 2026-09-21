export type ClasseAtivo = 'ACAO' | 'FII' | 'RENDA_FIXA';
export type TipoOperacao = 'COMPRA' | 'VENDA';

export interface Operacao {
  id: number;
  ticker: string;
  tipo: TipoOperacao;
  quantidade: string;
  preco_unitario: string;
  custos: string;
  data_operacao: string;
}

export interface CreateOperacaoPayload {
  ticker: string;
  tipo: TipoOperacao;
  data: string;
  quantidade: number;
  preco: number;
  custos?: number;
  classe?: ClasseAtivo;
}
