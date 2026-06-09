import { api } from "../lib/api";
import type { ApiResponse } from "../types/api";

export const deleteAccount = async (): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>("/account", {
        data: {
            confirmation: "DELETE",
        },
    });

    return response.data;
};
