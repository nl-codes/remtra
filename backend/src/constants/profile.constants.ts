export const PROFILE_GENDERS = ["male", "female", "others"] as const;

export type ProfileGender = (typeof PROFILE_GENDERS)[number];
