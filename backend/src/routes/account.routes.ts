import { Router } from "express";
import { deleteAccount } from "../controllers/account.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/zod.middleware.js";
import { deleteAccountSchema } from "../schemas/account.schema.js";

const router = Router();

router.delete("/", requireAuth, validate(deleteAccountSchema), deleteAccount);

export default router;
