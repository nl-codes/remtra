import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.config.js";

const startServer = async (): Promise<void> => {
    await mongoose.connect(env.MONGO_URI);

    app.listen(env.PORT, () => {
        console.log(`RemTra API running on port ${env.PORT}`);
        console.log("✅ Server Up 🌅 and Running 🏃");
    });
};

startServer().catch((error: unknown) => {
    console.error("❌ Failed to start server", error);
    process.exit(1);
});
