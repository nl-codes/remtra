import { Router } from "express";

import { validate } from "../middlewares/zod.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { registerProfileSchema } from "../schemas/profile.schema.js";
import { registerProfile } from "../controllers/profile.controller.js";

const router = Router();

router.post("/", requireAuth, validate(registerProfileSchema), registerProfile);

export default router;
