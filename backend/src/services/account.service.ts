import mongoose from "mongoose";
import { AppError } from "../middlewares/error.middleware.js";
import { PasswordResetModel } from "../models/password-reset.js";
import { ProfileModel } from "../models/profile.model.js";
import { UserModel } from "../models/user.model.js";

export interface DeletedAccountContact {
    username: string;
    email: string;
}

export class AccountService {
    public static async deleteAccount(
        userId: string,
    ): Promise<DeletedAccountContact> {
        const session = await mongoose.startSession();

        try {
            const deletedAccount = await session.withTransaction(async () => {
                await ProfileModel.deleteOne({ userId }).session(session);
                await PasswordResetModel.deleteMany({ userId }).session(
                    session,
                );

                const deletedUser =
                    await UserModel.findByIdAndDelete(userId).session(session);

                if (!deletedUser) {
                    throw new AppError("User account not found", 404);
                }

                return {
                    username: deletedUser.username,
                    email: deletedUser.email,
                };
            });

            if (!deletedAccount) {
                throw new AppError("Unable to delete user account", 500);
            }

            return deletedAccount;
        } finally {
            await session.endSession();
        }
    }
}
