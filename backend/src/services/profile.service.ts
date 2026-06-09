import type { JwtPayload } from "../lib/jwt.js";
import { AppError } from "../middlewares/error.middleware.js";
import { ProfileModel, type ProfileDocument } from "../models/profile.model.js";
import { UserModel } from "../models/user.model.js";
import type {
    RegisterProfileInput,
    SearchProfilesQuery,
    UpdateProfileInput,
    UpdateProfilePictureInput,
} from "../schemas/profile.schema.js";
import type { ProfileGender } from "../constants/profile.constants.js";

const isDuplicateKeyError = (error: unknown): error is { code: number } => {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
    );
};

const toProfileResponse = (profile: ProfileDocument): ProfileResponse => ({
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    firstName: profile.firstName,
    lastName: profile.lastName,
    pictureUrl: profile.pictureUrl,
    bio: profile.bio,
    gender: profile.gender,
    country: profile.country,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
});

export interface ProfileResponse {
    id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    pictureUrl?: string;
    bio?: string;
    gender?: ProfileGender;
    country?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProfileSearchResult {
    profiles: ProfileResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const escapeRegex = (value: string): string => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

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

            return toProfileResponse(profile);
        } catch (error) {
            if (isDuplicateKeyError(error)) {
                throw new AppError("Profile already exists", 409);
            }

            throw error;
        }
    }

    public static async getProfileByUserId(
        userId: string,
    ): Promise<ProfileResponse> {
        const profile = await ProfileModel.findOne({ userId });

        if (!profile) {
            throw new AppError("Profile not found", 404);
        }

        return toProfileResponse(profile);
    }

    public static async updateProfile(
        requester: JwtPayload,
        input: UpdateProfileInput,
    ): Promise<ProfileResponse> {
        const profile = await ProfileModel.findOneAndUpdate(
            { userId: requester.userId },
            { $set: input },
            {
                new: true,
                runValidators: true,
            },
        );

        if (!profile) {
            throw new AppError("Profile not found", 404);
        }

        return toProfileResponse(profile);
    }

    public static async deleteProfile(requester: JwtPayload): Promise<void> {
        const profile = await ProfileModel.findOneAndDelete({
            userId: requester.userId,
        });

        if (!profile) {
            throw new AppError("Profile not found", 404);
        }
    }

    public static async updateProfilePicture(
        requester: JwtPayload,
        input: UpdateProfilePictureInput,
    ): Promise<ProfileResponse> {
        const update =
            input.pictureUrl === null
                ? { $unset: { pictureUrl: 1 } }
                : { $set: { pictureUrl: input.pictureUrl } };

        const profile = await ProfileModel.findOneAndUpdate(
            { userId: requester.userId },
            update,
            {
                new: true,
                runValidators: true,
            },
        );

        if (!profile) {
            throw new AppError("Profile not found", 404);
        }

        return toProfileResponse(profile);
    }

    public static async searchProfiles(
        query: SearchProfilesQuery,
    ): Promise<ProfileSearchResult> {
        const searchPattern = new RegExp(escapeRegex(query.q), "i");
        const filter = {
            $or: [{ firstName: searchPattern }, { lastName: searchPattern }],
        };
        const skip = (query.page - 1) * query.limit;

        const [profiles, total] = await Promise.all([
            ProfileModel.find(filter)
                .sort({ firstName: 1, lastName: 1, _id: 1 })
                .skip(skip)
                .limit(query.limit),
            ProfileModel.countDocuments(filter),
        ]);

        return {
            profiles: profiles.map(toProfileResponse),
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages: Math.ceil(total / query.limit),
            },
        };
    }
}
