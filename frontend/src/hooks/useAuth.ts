import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "../store/auth.store";

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};
