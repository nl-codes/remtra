export interface AuthUser {
    id: string;
    username: string;
    email: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    user: AuthUser;
}

export interface LoginRequest {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    user: AuthUser;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}
