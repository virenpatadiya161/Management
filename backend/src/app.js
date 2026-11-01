import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import articleRoutes from "./routes/article.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Article Management API is running!",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

export default app;
