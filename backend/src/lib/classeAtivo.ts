export type ClasseAtivoDb = "ACAO" | "FII" | "RENDA_FIXA";
export type ClasseAtivoLabel = "Ação" | "FII" | "Renda Fixa";

const DB_PARA_LABEL: Record<ClasseAtivoDb, ClasseAtivoLabel> = {
  ACAO: "Ação",
  FII: "FII",
  RENDA_FIXA: "Renda Fixa",
};

export function classeParaLabel(classe: ClasseAtivoDb): ClasseAtivoLabel {
  return DB_PARA_LABEL[classe];
}
