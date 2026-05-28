import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { formatZodError } from "../lib/zod-validator.js";
import { env } from "../config/env.config.js";

export class AppError extends Error {
    public readonly statusCode: number;

    public constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next,
) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: formatZodError(error),
        });
        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(env.NODE_ENV === "development" ? { error: String(error) } : {}),
    });
};
