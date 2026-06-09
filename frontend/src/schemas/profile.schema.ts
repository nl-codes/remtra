import { z } from "zod";
import { profileGenders } from "../types/profile";

const optionalText = (maxLength: number, message: string) =>
    z.string().trim().max(maxLength, message);

export const profileFormSchema = z.object({
    firstName: optionalText(50, "First name must be at most 50 characters"),
    lastName: optionalText(50, "Last name must be at most 50 characters"),
    pictureUrl: z
        .string()
        .trim()
        .refine(
            (value) => value === "" || z.url().safeParse(value).success,
            "Enter a valid picture URL",
        )
        .refine(
            (value) => value.length <= 2048,
            "Picture URL must be at most 2048 characters",
        ),
    bio: optionalText(500, "Bio must be at most 500 characters"),
    gender: z.union([z.enum(profileGenders), z.literal("")]),
    country: optionalText(64, "Country must be at most 64 characters"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
