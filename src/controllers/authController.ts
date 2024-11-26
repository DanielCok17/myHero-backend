import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

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

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({ token, user });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id, email, firstName, lastName } = req.user;

        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                role: "CUSTOMER",
                profile: {
                    create: {
                        firstName: firstName || "",
                        lastName: lastName || "",
                    },
                },
            },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).json({ token, user });
    } catch (error) {
        console.error("Error in googleAuthCallback:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const facebookAuthCallback = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id, email, firstName, lastName } = req.user;

        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                role: "CUSTOMER",
                profile: {
                    create: {
                        firstName: firstName || "",
                        lastName: lastName || "",
                    },
                },
            },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).json({ token, user });
    } catch (error) {
        console.error("Error in facebookAuthCallback:", error);
        return res.status(500).json({ message: "Server error" });
    }
};