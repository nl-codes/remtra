import { Router } from "express";
import {
    register,
    login,
    forgotPassword,
    verifyResetPasswordToken,
    resetPassword,
    logout,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/zod.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyResetPasswordTokenSchema,
    resetPasswordSchema,
} from "../schemas/auth.schema.js";

const router = Router();

// Public Routes (no Authorization required)
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.get(
    "/validate-reset-password-token/:token",
    validate(verifyResetPasswordTokenSchema),
    verifyResetPasswordToken,
);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

// Protected Routes (Authorization required)
router.post("/logout", requireAuth, logout);
export default router;
