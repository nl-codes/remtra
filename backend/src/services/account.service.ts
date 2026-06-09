import mongoose from "mongoose";
import { AppError } from "../middlewares/error.middleware.js";
import { PasswordResetModel } from "../models/password-reset.js";
import { ProfileModel } from "../models/profile.model.js";
import { UserModel } from "../models/user.model.js";

export class AccountService {
    public static async deleteAccount(userId: string): Promise<void> {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                await ProfileModel.deleteOne({ userId }).session(session);
                await PasswordResetModel.deleteMany({ userId }).session(
                    session,
                );

                const deletedUser =
                    await UserModel.findByIdAndDelete(userId).session(session);

                if (!deletedUser) {
                    throw new AppError("User account not found", 404);
                }
            });
        } finally {
            await session.endSession();
        }
    }
}
