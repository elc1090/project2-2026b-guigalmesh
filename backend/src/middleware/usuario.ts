import { Request } from "express";

// Enquanto não existe login: sempre o mesmo usuário (seed da migration inicial).
export function getUsuarioId(_req: Request): string {
  return process.env.DEFAULT_USUARIO_ID ?? "00000000-0000-0000-0000-000000000001";
}
