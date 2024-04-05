import { Router } from "express";
import { connectUser, createUser } from "../controllers/userController";

const router = Router();

router.post("/api/v01/register", createUser);
router.post("/api/v01/log", connectUser);

export default router;
