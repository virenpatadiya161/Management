import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validate required fields
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        // 2. Validate email format
        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Please provide a valid email address",
            });
        }

        // 3. Validate password
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }

        if (Buffer.byteLength(password, "utf8") > 72) {
            return res.status(400).json({
                message: "Password must not exceed 72 bytes",
            });
        }

        // 4. Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }

        // 5. Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // 6. Create user and assign role
        const user = await prisma.$transaction(async (tx) => {
            const userCount = await tx.user.count();

            const role = userCount === 0 ? "ADMIN" : "USER";

            return tx.user.create({
                data: {
                    name: name.trim(),
                    email: normalizedEmail,
                    passwordHash,
                    role,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            });
        });

        // 7. Send response without password/hash
        return res.status(201).json({
            message: "Registration successful",
            user,
        });
    } catch (error) {
        // Handle duplicate email
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }

        console.error("Register error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate required fields
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        // 2. Check JWT secret
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret || jwtSecret === "your-long-random-secret") {
            console.error("JWT_SECRET is missing or is a placeholder");

            return res.status(500).json({
                message: "Server configuration error",
            });
        }

        // 3. Find user by email
        const user = await prisma.user.findUnique({
            where: {
                email: email.trim().toLowerCase(),
            },
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // 4. Verify password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // 5. Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            jwtSecret,
            {
                expiresIn: "1h",
                algorithm: "HS256",
            }
        );

        // 6. Return token and safe user details
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};