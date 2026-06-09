import { Router } from "express";

import { validate } from "../middlewares/zod.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
    getProfileSchema,
    registerProfileSchema,
} from "../schemas/profile.schema.js";
import {
    getMyProfile,
    getProfileByUserId,
    registerProfile,
} from "../controllers/profile.controller.js";

const router = Router();

router.post("/", requireAuth, validate(registerProfileSchema), registerProfile);
router.get("/", requireAuth, getMyProfile);
router.get(
    "/user/:userId",
    requireAuth,
    validate(getProfileSchema),
    getProfileByUserId,
);

export default router;
