import type { Request, Response } from "express";
import { asyncHandler } from "../lib/async-handler.js";
import { registerSchema } from "../schemas/auth.schema.js";
import { AuthService, type RegisterResult } from "../services/auth.service.js";
import type { ApiResponse } from "../types/api-response.js";

export const register = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const { body } = registerSchema.parse({ body: req.body });
        const result = await AuthService.register(body);

        const response: ApiResponse<RegisterResult> = {
            success: true,
            message: "User registered successfully",
            data: result,
        };

        res.status(201).json(response);
    },
);
