import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        username: z
            .string()
            .trim()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must be at most 30 characters"),
        email: z.email("Enter a valid email address").toLowerCase(),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password must be at most 128 characters"),
    }),
});

export const loginSchema = z.object({
    body: z
        .object({
            identifier: z
                .string()
                .trim()
                .min(1, "Username or Email is required"),
            password: z
                .string()
                .min(8, "Password must be at least 8 characters")
                .max(128, "Password must be at most 128 characters"),
        })
        .refine(
            (data) => {
                // If it looks like an email, validate it as one
                if (data.identifier.includes("@")) {
                    return z.email().safeParse(data.identifier).success;
                }
                // Otherwise, validate it against your username criteria
                return (
                    data.identifier.length >= 3 && data.identifier.length <= 128
                );
            },
            {
                message: "Please enter a valid username or email address",
                path: ["identifier"],
            },
        ),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.email("Enter a valid email address").toLowerCase(),
    }),
});

export const verifyResetPasswordTokenSchema = z.object({
    params: z.object({
        token: z.string().regex(/^[a-f0-9]{64}$/, "Invalid reset token"),
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type VerifyResetPasswordTokenInput = z.infer<
    typeof verifyResetPasswordTokenSchema
>["params"];
