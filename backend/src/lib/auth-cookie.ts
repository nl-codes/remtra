import type { CookieOptions } from "express";
import { env } from "../config/env.config.js";

const ACCESS_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const accessTokenCookieOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
});
