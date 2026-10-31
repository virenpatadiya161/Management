import prisma from "../config/prisma.js";

export async function createArticle(req, res) {
    try {
        const { title, content } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof content !== "string" ||
            !content.trim()
        ) {
            return res.status(400).json({
                message: "Title and content are required",
            });
        }

        const article = await prisma.article.create({
            data: {
                title: title.trim(),
                content: content.trim(),
                authorId: req.user.id,
            },
        });

        res.status(201).json({
            message: "Article created successfully",
            article,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create article" });
    }
}

export async function getArticles(req, res) {
    try {
        const articles = await prisma.article.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                author: {
                    select: { id: true, name: true },
                },
            },
        });

        res.json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch articles" });
    }
}