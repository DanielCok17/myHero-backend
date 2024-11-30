import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const trafficLogger = async (req: Request, res: Response, next: NextFunction) => {
    const startTime = process.hrtime(); // Začiatok merania času

    res.on("finish", async () => {
        const duration = getDurationInMilliseconds(startTime); // Trvanie požiadavky
        const trafficData = {
            method: req.method,
            url: req.originalUrl,
            ipAddress: Array.isArray(req.ip) ? req.ip[0] : req.ip, // Zabezpečiť, že je to String
            userAgent: req.headers["user-agent"] || "Unknown User-Agent",
            statusCode: res.statusCode,
            duration,
            description: `${req.method} ${req.originalUrl}`, // Opis požiadavky
        };

        try {
            // Použitie Prisma na uloženie logu
            await prisma.trafficLog.create({
                data: trafficData,
            });
        } catch (error) {
            console.error("Error logging traffic:", error);
        }
    });

    next();
};

const getDurationInMilliseconds = (startTime: [number, number]): number => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    return Number((seconds * 1000 + nanoseconds / 1e6).toFixed(2));
};