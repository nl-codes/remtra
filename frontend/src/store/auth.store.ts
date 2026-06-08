import { createContext } from "react";
import type { AuthUser } from "../types/auth";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
    status: AuthStatus;
    user: AuthUser | null;
    setAuthenticated: (user: AuthUser) => void;
    clearAuth: () => void;
    refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
