import {
    model,
    Schema,
    Types,
    type HydratedDocument,
    type Model,
} from "mongoose";
import {
    PROFILE_GENDERS,
    type ProfileGender,
} from "../constants/profile.constants.js";

export interface Profile {
    userId: Types.ObjectId;
    firstName?: string;
    lastName?: string;
    pictureUrl?: string;
    bio?: string;
    gender?: ProfileGender;
    country?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ProfileDocument = HydratedDocument<Profile>;

const profileSchema = new Schema<Profile>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
            unique: true,
        },
        firstName: {
            type: String,
            trim: true,
            maxlength: 50,
            index: true,
        },
        lastName: {
            type: String,
            trim: true,
            maxlength: 50,
            index: true,
        },
        pictureUrl: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            enum: PROFILE_GENDERS,
        },
        country: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const ProfileModel: Model<Profile> = model<Profile>(
    "Profile",
    profileSchema,
);
