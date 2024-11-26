import { Router, Request, Response } from "express";

const router = Router();

router.post("/", (req: Request, res: Response) => {
    res.json({ message: "Web payment routes" });
});

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Web payment routes" });
});

export default router;