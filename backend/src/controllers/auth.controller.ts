import type { Request, Response } from "express";
import { asyncHandler } from "../lib/async-handler.js";
import {
    getValidatedBody,
    getValidatedParams,
} from "../lib/validated-request.js";
import type {
    ForgotPasswordInput,
    LoginInput,
    RegisterInput,
    ResetPasswordInput,
    VerifyResetPasswordTokenInput,
} from "../schemas/auth.schema.js";
import {
    AuthService,
    type AuthResponseData,
} from "../services/auth.service.js";
import type { ApiResponse } from "../types/api-response.js";
import { accessTokenCookieOptions } from "../lib/auth-cookie.js";
import { sendEmail } from "../services/email.service.js";
import { getResetPasswordHTML } from "../utils/html.utils.js";
import { env } from "../config/env.config.js";

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

export const forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const body = getValidatedBody<ForgotPasswordInput>(req);
        const result = await AuthService.forgotPassword(body);

        if (result) {
            const resetPasswordURL = `${env.CLIENT_URL}/reset-password?token=${result.token}`;

            const resetPasswordDetails = getResetPasswordHTML(
                result.user.username,
                resetPasswordURL,
            );

            await sendEmail({
                to: result.user.email,
                subject: "Reset Password Link for RemTra",
                html: resetPasswordDetails.html,
                text: resetPasswordDetails.text,
            });
        }

        const response: ApiResponse<void> = {
            success: true,
            message:
                "If an account exists, a reset password link has been sent to the email.",
        };

        res.status(200).json(response);
    },
);

export const verifyResetPasswordToken = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const params = getValidatedParams<VerifyResetPasswordTokenInput>(req);
        const isResetPasswordTokenValid =
            await AuthService.verifyResetPasswordToken(params);

        let success = false;
        let message = "Token invalid or has expired";
        if (isResetPasswordTokenValid) {
            success = true;
            message = "Token valid";
        }

        const response: ApiResponse<void> = {
            success: success,
            message: message,
        };

        res.status(200).json(response);
    },
);

export const resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const body = getValidatedBody<ResetPasswordInput>(req);

        await AuthService.resetPassword(body);

        const response: ApiResponse<void> = {
            success: true,
            message: "Password reset successfully",
        };

        res.status(200).json(response);
    },
);

export const logout = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
        res.clearCookie("accessToken", accessTokenCookieOptions());

        const response: ApiResponse<void> = {
            success: true,
            message: "Logged out successfully",
        };

        res.status(200).json(response);
    },
);
