import { Router } from "express";

import { authMiddleware }
    from "@/utils/authMiddleware";
import { liveController } from "@/controller/liveController";



const router = Router();

router.post(
    "/start",
    authMiddleware,
    liveController.start
);

export  const liveRoutes = router;