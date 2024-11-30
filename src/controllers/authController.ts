import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { generateAccessToken, generateRefreshToken, JWT_SECRET, JWT_REFRESH_SECRET } from "../utils/tokenUtils"; // Import funkcií z utils

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, role },
        });

        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({ token, user });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Overenie používateľa
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        // Generovanie tokenov
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email!,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            id: user.id,
        });

        // Uloženie refresh tokenu do databázy
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        res.status(200).json({
            accessToken,
            refreshToken,
            user,
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token is required" });
            return;
        }

        // Zmaže refresh token z databázy
        await prisma.user.updateMany({
            where: { refreshToken },
            data: { refreshToken: null },
        });

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error in logoutUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token is required" });
            return;
        }

        // Validácia tokenu a získanie payload
        let payload;
        try {
            payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
        } catch (err) {
            res.status(403).json({ message: "Invalid or expired refresh token" });
            return;
        }

        // Overenie, či refresh token existuje v databáze
        const user = await prisma.user.findFirst({ where: { id: payload.userId, refreshToken } });
        if (!user) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }

        // Generovanie nového access tokenu
        const newAccessToken = generateAccessToken({
            id: user.id,
            email: user.email!,
            role: user.role,
        });

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("Error in refreshAccessToken:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Žiadosť o reset hesla
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Vygenerovanie reset tokenu
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Nastavenie expirácia tokenu na 1 hodinu
        const expires = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { email },
            data: {
                passwordResetToken: hashedToken,
                passwordResetExpires: expires,
            },
        });

        // Posielanie emailu je tu len symbolické
        console.log(`Send this token via email: ${resetToken}`);

        res.status(200).json({ message: "Password reset token sent to email" });
    } catch (error) {
        console.error("Error in requestPasswordReset:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// 2. Reset hesla
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password } = req.body;

        // Hashovanie tokenu na porovnanie s databázou
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: {
                    gte: new Date(), // Token ešte neexpiruje
                },
            },
        });

        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }

        // Aktualizácia hesla
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const googleAuthCallback = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { email } = req.user;

        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                role: "CUSTOMER",
            },
        });

        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error("Error in googleAuthCallback:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const facebookAuthCallback = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { email } = req.user;

        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                role: "CUSTOMER",
            },
        });

        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error("Error in facebookAuthCallback:", error);
        res.status(500).json({ message: "Server error" });
    }
};
