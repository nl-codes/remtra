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
    email: string;
    password: string;
}

export interface LoginResponse {
    user: AuthUser;
}
