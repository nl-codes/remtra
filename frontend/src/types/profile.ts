export const profileGenders = ["male", "female", "others"] as const;

export type ProfileGender = (typeof profileGenders)[number];

export interface Profile {
    id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    pictureUrl?: string;
    bio?: string;
    gender?: ProfileGender;
    country?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProfileRequest {
    firstName?: string;
    lastName?: string;
    pictureUrl?: string;
    bio?: string;
    gender?: ProfileGender;
    country?: string;
}

export type UpdateProfileRequest = Omit<
    CreateProfileRequest,
    "pictureUrl"
>;

export interface UpdateProfilePictureRequest {
    pictureUrl: string | null;
}
