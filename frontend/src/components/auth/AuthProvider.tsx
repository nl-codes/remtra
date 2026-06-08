import { AxiosError } from "axios";
import {
    type PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { getAuthSession } from "../../services/auth.api";
import {
    AuthContext,
    type AuthContextValue,
    type AuthStatus,
} from "../../store/auth.store";
import type { AuthUser } from "../../types/auth";

export default function AuthProvider({ children }: PropsWithChildren) {
    const [status, setStatus] = useState<AuthStatus>("checking");
    const [user, setUser] = useState<AuthUser | null>(null);

    const setAuthenticated = useCallback(
        (authenticatedUser: AuthUser): void => {
            setUser(authenticatedUser);
            setStatus("authenticated");
        },
        [],
    );

    const clearAuth = useCallback((): void => {
        setUser(null);
        setStatus("unauthenticated");
    }, []);

    const refreshAuth = useCallback(async (): Promise<void> => {
        try {
            const response = await getAuthSession();

            if (response.data) {
                setAuthenticated(response.data.user);
                return;
            }

            clearAuth();
        } catch (error) {
            if (
                !(error instanceof AxiosError) ||
                error.response?.status !== 401
            ) {
                console.error("Unable to verify authentication session", error);
            }

            clearAuth();
        }
    }, [clearAuth, setAuthenticated]);

    useEffect(() => {
        let isActive = true;

        void getAuthSession()
            .then((response) => {
                if (!isActive) {
                    return;
                }

                if (response.data) {
                    setAuthenticated(response.data.user);
                    return;
                }

                clearAuth();
            })
            .catch((error: unknown) => {
                if (!isActive) {
                    return;
                }

                if (
                    !(error instanceof AxiosError) ||
                    error.response?.status !== 401
                ) {
                    console.error(
                        "Unable to verify authentication session",
                        error,
                    );
                }

                clearAuth();
            });

        return () => {
            isActive = false;
        };
    }, [clearAuth, setAuthenticated]);

    const value = useMemo<AuthContextValue>(
        () => ({
            status,
            user,
            setAuthenticated,
            clearAuth,
            refreshAuth,
        }),
        [clearAuth, refreshAuth, setAuthenticated, status, user],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
