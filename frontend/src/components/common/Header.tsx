import { AxiosError } from "axios";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { appToast } from "../../lib/toast";
import { logoutUser } from "../../services/auth.api";
import type { ApiResponse } from "../../types/api";
import Logo from "./Logo";
import { useAuth } from "../../hooks/useAuth";
import Button from "./Button";
import ProfileAvatarButton from "../profile/ProfileAvatarButton";

const getLogoutErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const response = error.response?.data as ApiResponse<void> | undefined;

        return response?.message ?? "Unable to log out. Please try again.";
    }

    return "Unable to log out. Please try again.";
};

export default function Header() {
    const navigate = useNavigate();
    const { clearAuth } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async (): Promise<void> => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        try {
            const response = await logoutUser();

            clearAuth();
            appToast.success(response.message);
            navigate(routes.login, { replace: true });
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                clearAuth();
                navigate(routes.login, { replace: true });
                return;
            }

            appToast.error(getLogoutErrorMessage(error));
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="sticky top-0 z-30 py-2 border-b border-border-divider bg-primary-background/95 backdrop-blur">
            <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-4">
                    <Logo />
                    <div className="hidden min-w-0 border-l border-border-divider pl-4 sm:block">
                        <p className="truncate text-sm font-semibold text-text-primary">
                            Personal dashboard
                        </p>
                        <p className="truncate text-xs text-text-muted">
                            Habits and life events
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ProfileAvatarButton />
                    <Button
                        aria-label="Log out"
                        disabled={isLoggingOut}
                        icon={
                            isLoggingOut ? (
                                <Loader2
                                    aria-hidden="true"
                                    className="animate-spin"
                                />
                            ) : (
                                <LogOut aria-hidden="true" />
                            )
                        }
                        onClick={handleLogout}
                        title="Log out"
                        variant="secondary">
                        <span className="hidden sm:inline">
                            {isLoggingOut ? "Logging out..." : "Log out"}
                        </span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
