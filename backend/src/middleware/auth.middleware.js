import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7)
            : null;

        if (!token) {
            return res.status(401).json({ message: "Please login first" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"],
        });

        if (!decoded || typeof decoded !== "object" || !Number.isInteger(decoded.userId)) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, role: true },
        });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        console.error(error);
        return res.status(500).json({ message: "Authentication failed" });
    }
}

export function requireAdmin(req, res, next) {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin access only" });
    }

    next();
}