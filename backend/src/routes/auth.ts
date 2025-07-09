// routes/auth.ts
import { Router } from "express";
import { register, login, getCurrentUser } from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import { registerSchema, loginSchema } from "../validations/auth";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.get("/me", authenticate, getCurrentUser);
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);

export default router;
