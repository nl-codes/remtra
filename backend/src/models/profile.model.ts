import {
    model,
    Schema,
    Types,
    type Model,
} from "mongoose";

export interface Profile {
    userId: Types.ObjectId;
    pictureUrl?: string;
    bio?: string;
    gender?: string;
    country?: string;
    createdAt: Date;
    updatedAt: Date;
}

const profileSchema = new Schema<Profile>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
            unique: true,
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
