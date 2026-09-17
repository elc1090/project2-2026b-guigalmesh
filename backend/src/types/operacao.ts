import { z } from "zod";

export const createOperacaoSchema = z.object({
  ticker: z.string().min(1).max(20),
  tipo: z.enum(["COMPRA", "VENDA"]),
  data: z.string().min(1), // vem como "2026-09-16" do <input type="date">
  quantidade: z.coerce.number().positive(),
  preco: z.coerce.number().positive(),
  custos: z.coerce.number().min(0).optional().default(0),
  // Só é obrigatório quando o ticker ainda não existe no catálogo
  classe: z.enum(["ACAO", "FII", "RENDA_FIXA"]).optional(),
});

export type CreateOperacaoInput = z.infer<typeof createOperacaoSchema>;
