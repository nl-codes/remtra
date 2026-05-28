import type { Request, Response } from "express";
import { asyncHandler } from "../lib/async-handler.js";
import { getValidatedBody } from "../lib/validated-request.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import {
    AuthService,
    type AuthResponseData,
} from "../services/auth.service.js";
import type { ApiResponse } from "../types/api-response.js";
import { accessTokenCookieOptions } from "../lib/auth-cookie.js";

export const register = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const body = getValidatedBody<RegisterInput>(req);
        const result = await AuthService.register(body);

        const response: ApiResponse<AuthResponseData> = {
            success: true,
            message: "User registered successfully",
            data: { user: result.user },
        };

        res.cookie("accessToken", result.token, accessTokenCookieOptions());

        res.status(201).json(response);
    },
);

export const login = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const body = getValidatedBody<LoginInput>(req);
        const result = await AuthService.login(body);

        const response: ApiResponse<AuthResponseData> = {
            success: true,
            message: "User logged in successfully",
            data: { user: result.user },
        };

        res.cookie("accessToken", result.token, accessTokenCookieOptions());

        res.status(200).json(response);
    },
);
