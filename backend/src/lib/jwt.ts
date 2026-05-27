import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.config.js";

export interface JwtPayload {
    userId: string;
}

export const generateToken = (payload: JwtPayload): string => {
    const signOptions: SignOptions = {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, env.JWT_SECRET, signOptions);
};
