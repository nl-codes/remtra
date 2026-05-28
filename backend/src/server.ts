import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.config.js";
import { Server } from "http";

const startServer = async (): Promise<void> => {
    try {
        // 1. Connect to Database
        await mongoose.connect(env.MONGO_URI);
        console.log("📡 Connected to MongoDB successfully");

        // 2. Start Express Server
        const server: Server = app.listen(env.PORT, () => {
            // Get the actual address from the server instance
            const address = server.address();

            // If address is an object, get the port; otherwise it's a string (for pipes/sockets)
            const actualPort =
                typeof address === "string" ? address : address?.port;

            console.log(`🚀 RemTra API running on port: ${actualPort}`);
            console.log("✅ Server Up 🌅 and Running 🏃");
        });

        // 3. Handle specific Server Errors (like Port Busy)
        server.on("error", (error: NodeJS.ErrnoException) => {
            if (error.code === "EADDRINUSE") {
                console.error(`❌ Port ${env.PORT} is already in use.`);
            } else {
                console.error("❌ Server error:", error);
            }
            process.exit(1);
        });
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};

// Start the sequence
startServer().catch((error: unknown) => {
    console.error("❌ Unexpected startup error:", error);
    process.exit(1);
});
