import { Router } from "express";
import { postOperacao, getOperacoes } from "../controllers/operacoes.controller";

const router = Router();
router.post("/", postOperacao);
router.get("/", getOperacoes);

export default router;
