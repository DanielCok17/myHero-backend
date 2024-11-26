import { Router, Request, Response } from "express";

const router = Router();

router.post("/login", (req: Request, res: Response) => {
    res.json({ message: "Mobile auth routes" });
});

export default router;