import { Router } from "express";
import mobileRoutes from "./mobile";
import webRoutes from "./web";
import authRoutes from "./authRoutes";

const router = Router();

// Group mobile routes under `/mobile`
router.use("/mobile", mobileRoutes);

// Group web routes under `/web`
router.use("/web", webRoutes);

// Share auth routes between web and mobile
router.use("/web/auth", authRoutes);
router.use("/mobile/auth", authRoutes);

export default router;