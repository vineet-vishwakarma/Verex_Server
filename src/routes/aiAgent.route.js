import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { AiAgent } from "../controllers/aiAgent.controller.js";

const router = Router();
router.post('/agent', authMiddleware, AiAgent);

export default router;