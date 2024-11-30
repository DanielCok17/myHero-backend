import { Request, Response, NextFunction } from "express";
import validator from "validator";

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password, role } = req.body;

    // Overenie e-mailu
    if (!email || !validator.isEmail(email)) {
        res.status(400).json({ message: "Invalid email format" });
        return;
    }

    // Overenie hesla (napríklad minimálna dĺžka 6 znakov)
    if (!password || password.length < 6) {
        res.status(400).json({ message: "Password must be at least 6 characters long" });
        return;
    }

    // Overenie role (ak je potrebné)
    const validRoles = ["CUSTOMER", "INFLUENCER", "ADMIN"];
    if (!role || !validRoles.includes(role)) {
        res.status(400).json({ message: "Invalid role specified" });
        return;
    }

    next(); // Ak všetko prešlo, pokračuj na ďalšiu middleware alebo controller
};