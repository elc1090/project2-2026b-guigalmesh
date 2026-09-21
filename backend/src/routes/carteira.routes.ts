import { Router } from "express";
import { getCarteira, getEvolucaoPatrimonial } from "../controllers/carteira.controller";

const router = Router();
router.get("/evolucao", getEvolucaoPatrimonial); // NOVA ROTA AQUI
router.get("/", getCarteira);

export default router;
