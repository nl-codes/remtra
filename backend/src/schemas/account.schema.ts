import { z } from "zod";

export const deleteAccountSchema = z.object({
    body: z.object({
        confirmation: z.literal("DELETE", {
            error: 'Type "DELETE" to confirm account deletion',
        }),
    }),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>["body"];
