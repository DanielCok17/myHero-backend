import { Role } from "@prisma/client";
import "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: Role; // Match the Role enum from Prisma
            };
        }
    }
}