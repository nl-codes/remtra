import type { JwtPayload } from "../lib/jwt.js";
import { AppError } from "../middlewares/error.middleware.js";
import { ProfileModel } from "../models/profile.model.js";
import { UserModel } from "../models/user.model.js";
import type { RegisterProfileInput } from "../schemas/profile.schema.js";

const isDuplicateKeyError = (error: unknown): error is { code: number } => {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
    );
};

export interface ProfileResponse {
    id: string;
    userId: string;
    pictureUrl?: string;
    bio?: string;
    gender?: string;
    country?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class ProfileService {
    public static async registerProfile(
        requester: JwtPayload,
        input: RegisterProfileInput,
    ): Promise<ProfileResponse> {
        const userId = requester.userId;

        const userExists = await UserModel.exists({ _id: userId });

        if (!userExists) {
            throw new AppError("Authentication failed", 401);
        }

        const existingProfile = await ProfileModel.exists({ userId });

        if (existingProfile) {
            throw new AppError("Profile already exists", 409);
        }

        try {
            const profile = await ProfileModel.create({
                userId,
                ...input,
            });

            return {
                id: profile._id.toString(),
                userId: profile.userId.toString(),
                pictureUrl: profile.pictureUrl,
                bio: profile.bio,
                gender: profile.gender,
                country: profile.country,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
            };
        } catch (error) {
            if (isDuplicateKeyError(error)) {
                throw new AppError("Profile already exists", 409);
            }

            throw error;
        }
    }
}
