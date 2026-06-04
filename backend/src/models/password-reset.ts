import {
    model,
    Schema,
    Types,
    type HydratedDocument,
    type Model,
} from "mongoose";

export interface PasswordReset {
    userId: Types.ObjectId;
    tokenHash: string;
    tokenExpiresAt: Date;
    requestCount: number;
    requestWindowStartedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type PasswordResetDocument = HydratedDocument<PasswordReset>;

const passwordResetSchema = new Schema<PasswordReset>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
            unique: true,
        },
        tokenHash: {
            type: String,
            required: true,
        },
        tokenExpiresAt: {
            type: Date,
            required: true,
        },
        requestCount: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
            max: 3,
        },
        requestWindowStartedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 86400,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const PasswordResetModel: Model<PasswordReset> = model<PasswordReset>(
    "PasswordReset",
    passwordResetSchema,
);
