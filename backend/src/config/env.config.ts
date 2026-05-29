import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: z.coerce.number().int().positive().default(5000),
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_EXPIRES_IN: z.string().min(1).default("7d"),
    CLIENT_URL: z.url().default("http://localhost:8081"),
    ADDITIONAL_CLIENT_URLS: z
        .string()
        .optional()
        .transform((value) => {
            if (!value) {
                return [];
            }

            return value
                .split(",")
                .map((url) => url.trim())
                .filter(Boolean);
        })
        .pipe(z.array(z.url())),
});

export const env = envSchema.parse(process.env);
