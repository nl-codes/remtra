import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType } from "zod";
import { ZodError } from "zod";
import { formatZodError } from "../lib/zod-validator.js";

export const validate =
    (schema: ZodType): RequestHandler =>
    (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        if (!result.success) {
            const error = new ZodError(result.error.issues);
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: formatZodError(error),
            });
            return;
        }

        next();
    };
