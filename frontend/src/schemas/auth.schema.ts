import { z } from "zod";

export const registerFormSchema = z.object({
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
});

export const loginFormSchema = z.object({
    email: z.email("Enter a valid email address").toLowerCase(),
    password: z
        .string()
        .min(8, "Password is at least 8 characters")
        .max(128, "Password is at most 128 characters"),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
