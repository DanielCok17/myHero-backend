import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";

// Funkcia na generovanie access tokenu (krátka platnosť)
export const generateAccessToken = (user: { id: string; email: string; role: string }): string => {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "15m" } // Access token platí 15 minút
    );
};

// Funkcia na generovanie refresh tokenu (dlhá platnosť)
export const generateRefreshToken = (user: { id: string }): string => {
    return jwt.sign(
        { userId: user.id },
        JWT_REFRESH_SECRET,
        { expiresIn: "7d" } // Refresh token platí 7 dní
    );
};