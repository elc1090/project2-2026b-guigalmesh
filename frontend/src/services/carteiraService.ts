import { apiFetch } from "./api";
import type { AtivoResumo } from "../features/carteira/TabelaAtivos";

export function getPosicoes() {
  return apiFetch<AtivoResumo[]>("/api/v1/carteira");
}
