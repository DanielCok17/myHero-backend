import { Router } from "express";
import userRoutes from "./userRoutes";

const mobileRouter = Router();

// Add routes for mobile API
mobileRouter.use("/users", userRoutes);

export default mobileRouter;