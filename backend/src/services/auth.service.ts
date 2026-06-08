import bcrypt from "bcryptjs";
import { AppError } from "../middlewares/error.middleware.js";
import { User, UserModel } from "../models/user.model.js";
import type {
    ForgotPasswordInput,
    LoginInput,
    RegisterInput,
    ResetPasswordInput,
    VerifyResetPasswordTokenInput,
} from "../schemas/auth.schema.js";
import { generateToken } from "../lib/jwt.js";
import {
    generateToken as generateCryptoToken,
    hashToken,
} from "../lib/crypto.js";
import { PasswordResetModel } from "../models/password-reset.js";

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

export interface ForgotPasswordResult {
    user: User;
    token: string;
}

const PASSWORD_RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000;
const PASSWORD_RESET_REQUEST_WINDOW_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_DAILY_LIMIT = 3;

export class AuthService {
    public static async getAuthenticatedUser(
        userId: string,
    ): Promise<AuthUserResponse> {
        const user = await UserModel.findById(userId).lean();

        if (!user) {
            throw new AppError("Authentication failed", 401);
        }

        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
        };
    }

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
        const normalizedEmail = input.identifier.toLowerCase();
        const normalizedUsername = input.identifier.trim();

        const user = await UserModel.findOne({
            $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
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

    public static async forgotPassword(
        input: ForgotPasswordInput,
    ): Promise<ForgotPasswordResult | null> {
        const normalizedEmail = input.email.toLowerCase();

        const existingUser = await UserModel.findOne({
            email: normalizedEmail,
        }).lean();

        if (!existingUser) {
            return null;
        }

        const now = new Date();
        const existingReset = await PasswordResetModel.findOne({
            userId: existingUser._id,
        });

        const isWithinRequestWindow =
            existingReset &&
            now.getTime() - existingReset.requestWindowStartedAt.getTime() <
                PASSWORD_RESET_REQUEST_WINDOW_MS;

        if (
            isWithinRequestWindow &&
            existingReset.requestCount >= PASSWORD_RESET_DAILY_LIMIT
        ) {
            throw new AppError(
                "Password reset request limit reached. Please try again later.",
                429,
            );
        }

        const requestCount = isWithinRequestWindow
            ? existingReset.requestCount + 1
            : 1;
        const requestWindowStartedAt = isWithinRequestWindow
            ? existingReset.requestWindowStartedAt
            : now;
        const resetPasswordToken = generateCryptoToken();
        const resetPasswordTokenHash = hashToken(resetPasswordToken);
        const tokenExpiresAt = new Date(
            now.getTime() + PASSWORD_RESET_TOKEN_EXPIRY_MS,
        );

        await PasswordResetModel.findOneAndUpdate(
            { userId: existingUser._id },
            {
                tokenHash: resetPasswordTokenHash,
                tokenExpiresAt,
                requestCount,
                requestWindowStartedAt,
                createdAt: requestWindowStartedAt,
            },
            {
                new: true,
                setDefaultsOnInsert: true,
                upsert: true,
            },
        );

        return { user: existingUser, token: resetPasswordToken };
    }

    public static async verifyResetPasswordToken(
        input: VerifyResetPasswordTokenInput,
    ): Promise<boolean> {
        const resetPasswordTokenHash = hashToken(input.token);

        const resetTokenExists = await PasswordResetModel.findOne({
            tokenHash: resetPasswordTokenHash,
            tokenExpiresAt: { $gt: new Date() },
        });

        return resetTokenExists !== null;
    }

    public static async resetPassword(
        input: ResetPasswordInput,
    ): Promise<void> {
        const resetPasswordTokenHash = hashToken(input.token);
        const hashedPassword = await bcrypt.hash(input.newPassword, 10);

        const passwordReset = await PasswordResetModel.findOneAndDelete({
            tokenHash: resetPasswordTokenHash,
            tokenExpiresAt: { $gt: new Date() },
        });

        if (!passwordReset) {
            throw new AppError("Reset password link has expired", 400);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            passwordReset.userId,
            { password: hashedPassword },
            { runValidators: true },
        );

        if (!updatedUser) {
            throw new AppError("Unable to reset password", 400);
        }
    }
}
