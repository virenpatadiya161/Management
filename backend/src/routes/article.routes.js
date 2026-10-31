import { Router } from "express";
import {
    getArticles,
    createArticle,
} from "../controllers/article.controller.js";
import {
    authenticateToken,
    requireAdmin,
} from "../middleware/auth.middleware.js";
import articleRoutes from "./routes/article.routes.js";

const router = Router();

router.get("/", getArticles);

router.post("/", authenticateToken, requireAdmin, createArticle);
app.use("/api/articles", articleRoutes);

export default router;