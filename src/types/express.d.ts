import { User } from "@prisma/client";

declare global {
    namespace Express {
        interface User {
            id: string;
            email: string;
            firstName?: string;
            lastName?: string;
        }

        interface Request {
            user?: User;
        }
    }
}