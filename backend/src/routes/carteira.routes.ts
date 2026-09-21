import { Router } from "express";
import { getCarteira } from "../controllers/carteira.controller";

const router = Router();
router.get("/", getCarteira);

export default router;
