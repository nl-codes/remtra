import { z } from "zod";
import { PROFILE_GENDERS } from "../constants/profile.constants.js";

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

const updateProfileField = <TSchema extends z.ZodType<string>>(
    schema: TSchema,
) => {
    return z.preprocess(
        (value) => {
            if (typeof value !== "string") {
                return value;
            }

            const trimmedValue = value.trim();
            return trimmedValue === "" ? null : trimmedValue;
        },
        z.union([schema, z.null()]).optional(),
    );
};

const genderSchema = z
    .string()
    .refine(
        (value): value is (typeof PROFILE_GENDERS)[number] =>
            PROFILE_GENDERS.some((gender) => gender === value),
        "Gender must be male, female, or others",
    );

const profileDetailsSchema = z.object({
    firstName: optionalProfileField(
        z.string().max(50, "First name must be at most 50 characters"),
    ),
    lastName: optionalProfileField(
        z.string().max(50, "Last name must be at most 50 characters"),
    ),
    bio: optionalProfileField(
        z.string().max(500, "Bio must be at most 500 characters"),
    ),
    gender: optionalProfileField(genderSchema),
    country: optionalProfileField(
        z.string().max(64, "Country must be at most 64 characters"),
    ),
});

const updateProfileDetailsSchema = z.object({
    firstName: updateProfileField(
        z.string().max(50, "First name must be at most 50 characters"),
    ),
    lastName: updateProfileField(
        z.string().max(50, "Last name must be at most 50 characters"),
    ),
    bio: updateProfileField(
        z.string().max(500, "Bio must be at most 500 characters"),
    ),
    gender: updateProfileField(genderSchema),
    country: updateProfileField(
        z.string().max(64, "Country must be at most 64 characters"),
    ),
});

const pictureUrlSchema = z
    .url("Enter a valid picture URL")
    .max(2048, "Picture URL must be at most 2048 characters");

const createProfileFieldsSchema = profileDetailsSchema.extend({
    pictureUrl: optionalProfileField(pictureUrlSchema),
});

const userIdParamsSchema = z.object({
    userId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID")
        .transform((value) => value.toLowerCase()),
});

export const registerProfileSchema = z.object({
    body: createProfileFieldsSchema,
});

export const getProfileSchema = z.object({
    params: userIdParamsSchema,
});

export const updateProfileSchema = z.object({
    body: updateProfileDetailsSchema.refine(
        (profileFields) =>
            Object.values(profileFields).some(
                (fieldValue) => fieldValue !== undefined,
            ),
        {
            message: "At least one profile field is required",
        },
    ),
});

export const updateProfilePictureSchema = z.object({
    body: z.object({
        pictureUrl: z.union([pictureUrlSchema, z.null()]),
    }),
});

export const searchProfilesSchema = z.object({
    query: z.object({
        q: z
            .string()
            .trim()
            .min(1, "Search query is required")
            .max(100, "Search query must be at most 100 characters"),
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(50).default(20),
    }),
});

export type RegisterProfileInput = z.infer<
    typeof registerProfileSchema
>["body"];
export type GetProfileParams = z.infer<typeof getProfileSchema>["params"];
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
export type UpdateProfilePictureInput = z.infer<
    typeof updateProfilePictureSchema
>["body"];
export type SearchProfilesQuery = z.infer<typeof searchProfilesSchema>["query"];
