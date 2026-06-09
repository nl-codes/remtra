import type { Request, Response } from "express";
import { asyncHandler } from "../lib/async-handler.js";
import { getValidatedBody } from "../lib/validated-request.js";
import type { RegisterProfileInput } from "../schemas/profile.schema.js";
import type { ApiResponse } from "../types/api-response.js";
import {
    type ProfileResponse,
    ProfileService,
} from "../services/profile.service.js";
import { AppError } from "../middlewares/error.middleware.js";

export const registerProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const body = getValidatedBody<RegisterProfileInput>(req);
        const initiator = req.user;

        if (!initiator) {
            throw new AppError("Authentication required", 401);
        }

        const profile = await ProfileService.registerProfile(initiator, body);

        const response: ApiResponse<ProfileResponse> = {
            success: true,
            message: "Profile created successfully",
            data: profile,
        };

        res.status(201).json(response);
    },
);
