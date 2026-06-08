import { NextFunction, Request, Response } from "express";
import { AppError } from "./error.middleware.js";
import { env } from "../config/env.config.js";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../lib/jwt.js";

export const requireAuth = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        throw new AppError("Authentication failed", 401);
    }

    try {
        const secret = env.JWT_SECRET;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.user = decoded; // { userId }
        next();
    } catch (err) {
        throw new AppError("Invalid or expired token", 401);
    }
};
