import { Router } from "express";
import {
    getArticles,
    createArticle,
} from "../controllers/article.controller.js";
import {
    authenticateToken,
    requireAdmin,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getArticles);

router.post("/", authenticateToken, requireAdmin, createArticle);

export default router;
