import { z } from "zod";

const optionalProfileField = <TSchema extends z.ZodType<string>>(
    schema: TSchema,
) => {
    return z.preprocess((value) => {
        if (typeof value !== "string") {
            return value;
        }

        const trimmedValue = value.trim();
        return trimmedValue === "" ? undefined : trimmedValue;
    }, schema.optional());
};

const profileFieldsSchema = z.object({
    pictureUrl: optionalProfileField(
        z
            .url("Enter a valid picture URL")
            .max(2048, "Picture URL must be at most 2048 characters"),
    ),
    bio: optionalProfileField(
        z.string().max(500, "Bio must be at most 500 characters"),
    ),
    gender: optionalProfileField(
        z.string().max(8, "Gender must be at most 8 characters"),
    ),
    country: optionalProfileField(
        z.string().max(64, "Country must be at most 64 characters"),
    ),
});

const userIdParamsSchema = z.object({
    userId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID")
        .transform((value) => value.toLowerCase()),
});

export const registerProfileSchema = z.object({
    body: profileFieldsSchema,
});

export const getProfileSchema = z.object({
    params: userIdParamsSchema,
});

export const updateProfileSchema = z.object({
    params: userIdParamsSchema,
    body: profileFieldsSchema.refine(
        (profileFields) =>
            Object.values(profileFields).some(
                (fieldValue) => fieldValue !== undefined,
            ),
        {
            message: "At least one profile field is required",
        },
    ),
});

export type RegisterProfileInput = z.infer<
    typeof registerProfileSchema
>["body"];
export type GetProfileParams = z.infer<typeof getProfileSchema>["params"];
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
export type UpdateProfileParams = z.infer<typeof updateProfileSchema>["params"];
