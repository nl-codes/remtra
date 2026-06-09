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

export const registerProfileSchema = z.object({
    body: z.object({
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
    }),
});

export type RegisterProfileInput = z.infer<
    typeof registerProfileSchema
>["body"];
