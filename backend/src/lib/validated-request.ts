import type { Request } from "express";
import { AppError } from "../middlewares/error.middleware.js";

export const getValidatedBody = <T>(req: Request): T => {
    if (!req.validated) {
        throw new AppError("Validated request data is missing");
    }

    return req.validated.body as T;
};
