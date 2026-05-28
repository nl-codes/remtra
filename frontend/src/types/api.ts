export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: ValidationError[];
}

export interface ValidationError {
    path: string;
    message: string;
}
