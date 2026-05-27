import { api } from "../lib/api";
import type { ApiResponse } from "../types/api";
import type { RegisterRequest, RegisterResponse } from "../types/auth";

export const registerUser = async (
    payload: RegisterRequest,
): Promise<ApiResponse<RegisterResponse>> => {
    const response = await api.post<ApiResponse<RegisterResponse>>("/auth/register", payload);

    return response.data;
};
