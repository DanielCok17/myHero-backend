import { Router } from "express";
import {
    registerUser,
    loginUser,
    googleAuthCallback,
    facebookAuthCallback,
} from "../controllers/authController";

const authRouter = Router();

/**
 * @swagger
 * /api/web/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [CUSTOMER, INFLUENCER, ADMIN]
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: User already exists.
 *       500:
 *         description: Server error.
 */
// Authentication endpoints
authRouter.post("/register", async (req, res, next) => {
    try {
        await registerUser(req, res);
    } catch (error) {
        next(error); // Pass errors to the Express error handler
    }
});

authRouter.post("/login", async (req, res, next) => {
    try {
        await loginUser(req, res);
    } catch (error) {
        next(error);
    }
});

authRouter.get("/google/callback", async (req, res, next) => {
    try {
        await googleAuthCallback(req, res);
    } catch (error) {
        next(error);
    }
});

authRouter.get("/facebook/callback", async (req, res, next) => {
    try {
        await facebookAuthCallback(req, res);
    } catch (error) {
        next(error);
    }
});

export default authRouter;