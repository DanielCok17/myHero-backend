import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client"; // Import Role enum from Prisma

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Define the JWT payload structure (matching Prisma's Role enum)
interface JwtPayload {
    userId: string;
    email: string;
    role: Role;
}

// Middleware function using Express's extended Request type
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: "Missing Authorization header" });
        return; // Stop further execution
    }

    const token = authHeader.split(" ")[1]; // Expecting format: "Bearer <token>"

    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

        // Attach user data to the request object
        req.user = {
            id: payload.userId,
            email: payload.email,
            role: payload.role,
        };

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};

// Extend Express's Request type to include the user property globally
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: Role;
            };
        }
    }
}