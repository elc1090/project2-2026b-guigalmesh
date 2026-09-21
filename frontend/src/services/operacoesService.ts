import { apiFetch } from "./api";
import { Operacao, CreateOperacaoPayload } from "../types/operacao";

export function listOperacoes() {
  return apiFetch<Operacao[]>("/api/v1/operacoes");
}

export function createOperacao(payload: CreateOperacaoPayload) {
  return apiFetch<Operacao>("/api/v1/operacoes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteOperacao(id: number) {
  return apiFetch(`/api/v1/operacoes/${id}`, {
    method: "DELETE",
  });
}
