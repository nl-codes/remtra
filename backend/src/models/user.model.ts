import { model, Schema, type HydratedDocument, type Model } from "mongoose";

export interface User {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<User>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const UserModel: Model<User> = model<User>("User", userSchema);
