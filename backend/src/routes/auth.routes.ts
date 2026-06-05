import { Router } from "express";
import {
    register,
    login,
    forgotPassword,
    verifyResetPasswordToken,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/zod.middleware.js";
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyResetPasswordTokenSchema,
} from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.get(
    "/validate-reset-password-token/:token",
    validate(verifyResetPasswordTokenSchema),
    verifyResetPasswordToken,
);

export default router;
