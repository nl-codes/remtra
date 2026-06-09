import type { Request, Response } from "express";
import { accessTokenCookieOptions } from "../lib/auth-cookie.js";
import { asyncHandler } from "../lib/async-handler.js";
import { getValidatedBody } from "../lib/validated-request.js";
import type { DeleteAccountInput } from "../schemas/account.schema.js";
import { AccountService } from "../services/account.service.js";
import { sendEmail } from "../services/email.service.js";
import type { ApiResponse } from "../types/api-response.js";
import { getGoodByeHTML } from "../utils/html.utils.js";

export const deleteAccount = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        getValidatedBody<DeleteAccountInput>(req);
        const deletedAccount = await AccountService.deleteAccount(
            req.user!.userId,
        );

        res.clearCookie("accessToken", accessTokenCookieOptions());

        const goodbyeEmail = getGoodByeHTML(deletedAccount.username);

        try {
            await sendEmail({
                to: deletedAccount.email,
                subject: "Goodbye from RemTra",
                html: goodbyeEmail.html,
                text: goodbyeEmail.text,
            });
        } catch (error) {
            console.error(
                "Account deleted, but goodbye email could not be sent:",
                error,
            );
        }

        const response: ApiResponse<void> = {
            success: true,
            message: "Your RemTra account and data were deleted successfully",
        };

        res.status(200).json(response);
    },
);
