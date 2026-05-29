import cors from "cors";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env.config.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const allowedOrigins = [env.CLIENT_URL, ...env.ADDITIONAL_CLIENT_URLS];

app.use(helmet());
app.use(cookieParser());
app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    }),
);
app.use(express.json());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "RemTra API is healthy" });
});

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

export default app;
