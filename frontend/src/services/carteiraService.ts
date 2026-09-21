import { apiFetch } from "./api";
import type { AtivoResumo } from "../features/carteira/TabelaAtivos";
import { DataPoint } from "../features/carteira/GraficoRentabilidade";

export function getPosicoes() {
  return apiFetch<AtivoResumo[]>("/api/v1/carteira");
}

export function getEvolucaoPatrimonial() {
  return apiFetch<DataPoint[]>("/api/v1/carteira/evolucao");
}
