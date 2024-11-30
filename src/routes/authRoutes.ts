import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
    registerUser,
    loginUser,
    googleAuthCallback,
    facebookAuthCallback,
    refreshAccessToken,
    requestPasswordReset,
    resetPassword,
    logoutUser
} from "../controllers/authController";
import { validateRegister } from "../validators/authValidator";

const authRouter = Router();

authRouter.post("/register", validateRegister, registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/refresh", refreshAccessToken);
authRouter.post("/password-reset/request", requestPasswordReset);
authRouter.post("/password-reset/reset", resetPassword);

// Protect routes with the authenticate middleware
authRouter.get("/google/callback", authenticate, googleAuthCallback);
authRouter.get("/facebook/callback", authenticate, facebookAuthCallback);

export default authRouter;