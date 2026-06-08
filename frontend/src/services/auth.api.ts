import { api } from "../lib/api";
import type { ApiResponse } from "../types/api";
import type {
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
} from "../types/auth";

export const registerUser = async (
    payload: RegisterRequest,
): Promise<ApiResponse<RegisterResponse>> => {
    const response = await api.post<ApiResponse<RegisterResponse>>(
        "/auth/register",
        payload,
    );

    return response.data;
};

export const loginUser = async (
    payload: LoginRequest,
): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        payload,
    );

    return response.data;
};

export const forgotPassword = async (
    payload: ForgotPasswordRequest,
): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(
        "/auth/forgot-password",
        payload,
    );
    return response.data;
};

export const verifyResetPasswordToken = async (
    token: string,
): Promise<ApiResponse<void>> => {
    const response = await api.get<ApiResponse<void>>(
        `/auth/validate-reset-password-token/${encodeURIComponent(token)}`,
    );

    return response.data;
};

export const resetPassword = async (
    payload: ResetPasswordRequest,
): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(
        "/auth/reset-password",
        payload,
    );

    return response.data;
};

export const logoutUser = async (): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>("/auth/logout");

    return response.data;
};

export const getAuthSession = async (): Promise<ApiResponse<LoginResponse>> => {
    const response =
        await api.get<ApiResponse<LoginResponse>>("/auth/session");

    return response.data;
};
