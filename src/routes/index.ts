import { Router } from "express";
import mobileRoutes from "./mobile";
import webRoutes from "./web";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/mobile", mobileRoutes);

router.use("/web", webRoutes);

// Share auth routes between web and mobile
router.use("/web/auth", authRoutes);
router.use("/mobile/auth", authRoutes);

export default router;