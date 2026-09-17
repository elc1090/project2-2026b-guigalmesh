// Regra documentada no schema: mercado fracionário usa o mesmo ticker + sufixo "F"
// (ex.: PETR4F é o lote fracionário de PETR4). O banco só conhece o ticker "cheio".
const TICKER_FRACIONARIO = /^[A-Z]{4}\d{1,2}F$/;

export function normalizeTicker(ticker: string): string {
  const upper = ticker.trim().toUpperCase();
  return TICKER_FRACIONARIO.test(upper) ? upper.slice(0, -1) : upper;
}
