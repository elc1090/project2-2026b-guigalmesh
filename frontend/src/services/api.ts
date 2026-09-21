const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export class ApiError extends Error {
  constructor(public codigo: string, mensagem: string) {
    super(mensagem);
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body = await res.json();

  if (!res.ok) {
    throw new ApiError(body.error?.codigo ?? "ERRO_DESCONHECIDO", body.error?.mensagem ?? "Erro inesperado.");
  }

  return body.data as T;
}
