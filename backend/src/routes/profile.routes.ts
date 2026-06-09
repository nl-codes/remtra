import { Router } from "express";

import { validate } from "../middlewares/zod.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
    getProfileSchema,
    registerProfileSchema,
    searchProfilesSchema,
    updateProfileSchema,
    updateProfilePictureSchema,
} from "../schemas/profile.schema.js";
import {
    deleteProfile,
    getMyProfile,
    getProfileByUserId,
    registerProfile,
    searchProfiles,
    updateProfile,
    updateProfilePicture,
} from "../controllers/profile.controller.js";

const router = Router();

router.post("/", requireAuth, validate(registerProfileSchema), registerProfile);
router.get("/", requireAuth, getMyProfile);
router.patch("/", requireAuth, validate(updateProfileSchema), updateProfile);
router.delete("/", requireAuth, deleteProfile);
router.patch(
    "/picture",
    requireAuth,
    validate(updateProfilePictureSchema),
    updateProfilePicture,
);
router.get("/search", validate(searchProfilesSchema), searchProfiles);
router.get(
    "/user/:userId",
    validate(getProfileSchema),
    getProfileByUserId,
);

export default router;
