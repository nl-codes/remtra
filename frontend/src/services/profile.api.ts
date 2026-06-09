import { api } from "../lib/api";
import type { ApiResponse } from "../types/api";
import type {
    CreateProfileRequest,
    Profile,
    UpdateProfilePictureRequest,
    UpdateProfileRequest,
} from "../types/profile";

export const getMyProfile = async (): Promise<ApiResponse<Profile>> => {
    const response = await api.get<ApiResponse<Profile>>("/profile");

    return response.data;
};

export const createProfile = async (
    payload: CreateProfileRequest,
): Promise<ApiResponse<Profile>> => {
    const response = await api.post<ApiResponse<Profile>>("/profile", payload);

    return response.data;
};

export const updateProfile = async (
    payload: UpdateProfileRequest,
): Promise<ApiResponse<Profile>> => {
    const response = await api.patch<ApiResponse<Profile>>("/profile", payload);

    return response.data;
};

export const updateProfilePicture = async (
    payload: UpdateProfilePictureRequest,
): Promise<ApiResponse<Profile>> => {
    const response = await api.patch<ApiResponse<Profile>>(
        "/profile/picture",
        payload,
    );

    return response.data;
};

export const deleteProfile = async (): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>("/profile");

    return response.data;
};
