import type { Request, Response } from "express";
import { asyncHandler } from "../lib/async-handler.js";
import {
    getValidatedBody,
    getValidatedParams,
} from "../lib/validated-request.js";
import type {
    GetProfileParams,
    RegisterProfileInput,
    UpdateProfileInput,
    UpdateProfileParams,
} from "../schemas/profile.schema.js";
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

export const getMyProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const initiator = req.user;

        if (!initiator) {
            throw new AppError("Authentication required", 401);
        }

        const profile = await ProfileService.getProfileByUserId(
            initiator.userId,
        );

        const response: ApiResponse<ProfileResponse> = {
            success: true,
            message: "Profile retrieved successfully",
            data: profile,
        };

        res.status(200).json(response);
    },
);

export const getProfileByUserId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const params = getValidatedParams<GetProfileParams>(req);
        const profile = await ProfileService.getProfileByUserId(params.userId);

        const response: ApiResponse<ProfileResponse> = {
            success: true,
            message: "Profile retrieved successfully",
            data: profile,
        };

        res.status(200).json(response);
    },
);

export const updateProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const initiator = req.user;

        if (!initiator) {
            throw new AppError("Authentication required", 401);
        }

        const params = getValidatedParams<UpdateProfileParams>(req);
        const body = getValidatedBody<UpdateProfileInput>(req);
        const profile = await ProfileService.updateProfile(
            initiator,
            params.userId,
            body,
        );

        const response: ApiResponse<ProfileResponse> = {
            success: true,
            message: "Profile updated successfully",
            data: profile,
        };

        res.status(200).json(response);
    },
);

export const deleteProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const initiator = req.user;

        if (!initiator) {
            throw new AppError("Authentication required", 401);
        }

        const params = getValidatedParams<GetProfileParams>(req);

        await ProfileService.deleteProfile(initiator, params.userId);

        const response: ApiResponse<void> = {
            success: true,
            message: "Profile deleted successfully",
        };

        res.status(200).json(response);
    },
);
