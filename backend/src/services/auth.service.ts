import bcrypt from "bcryptjs";
import { AppError } from "../middlewares/error.middleware.js";
import { UserModel } from "../models/user.model.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { generateToken } from "../lib/jwt.js";

export interface AuthUserResponse {
    id: string;
    username: string;
    email: string;
}

export interface AuthResult {
    user: AuthUserResponse;
    token: string;
}

export interface AuthResponseData {
    user: AuthUserResponse;
}

export class AuthService {
    public static async register(input: RegisterInput): Promise<AuthResult> {
        const normalizedEmail = input.email.toLowerCase();
        const normalizedUsername = input.username.trim();

        const existingUser = await UserModel.findOne({
            $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
        }).lean();

        if (existingUser) {
            throw new AppError("Username or email is already registered", 409);
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        const user = await UserModel.create({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword,
        });

        const userId = user._id.toString();
        const token = generateToken({ userId });

        return {
            user: {
                id: userId,
                username: user.username,
                email: user.email,
            },
            token,
        };
    }

    public static async login(input: LoginInput): Promise<AuthResult> {
        const normalizedEmail = input.email.toLowerCase();

        const user = await UserModel.findOne({
            email: normalizedEmail,
        }).select("+password");

        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const isPasswordCorrect = await bcrypt.compare(
            input.password,
            user.password,
        );

        if (!isPasswordCorrect) {
            throw new AppError("Invalid email or password", 401);
        }

        const userId = user._id.toString();
        const token = generateToken({ userId });

        return {
            user: {
                id: userId,
                username: user.username,
                email: user.email,
            },
            token,
        };
    }
}
