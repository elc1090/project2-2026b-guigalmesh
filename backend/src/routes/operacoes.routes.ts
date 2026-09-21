import { Router } from "express";
import { postOperacao, getOperacoes, removerOperacao } from "../controllers/operacoes.controller";

const router = Router();
router.post("/", postOperacao);
router.get("/", getOperacoes);
router.delete("/:id", removerOperacao);

export default router;
