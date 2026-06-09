import { CircleCheck, Clock3, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthBrandPanel from "../components/auth/AuthBrandPanel";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import Logo from "../components/common/Logo";
import { routes } from "../constants/routes";
import { verifyResetPasswordToken } from "../services/auth.api";
import { ButtonLink } from "../components/common/Button";

type TokenStatus = "verifying" | "valid" | "expired";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [tokenStatus, setTokenStatus] = useState<TokenStatus>("verifying");
    const [successMessage, setSuccessMessage] = useState("");
    const isValidTokenFormat = /^[a-f0-9]{64}$/.test(token);
    const displayedTokenStatus = isValidTokenFormat
        ? tokenStatus
        : "expired";

    useEffect(() => {
        let isActive = true;

        if (!isValidTokenFormat) {
            return;
        }

        const verifyToken = async (): Promise<void> => {
            try {
                const response = await verifyResetPasswordToken(token);

                if (isActive) {
                    setTokenStatus(response.success ? "valid" : "expired");
                }
            } catch {
                if (isActive) {
                    setTokenStatus("expired");
                }
            }
        };

        void verifyToken();

        return () => {
            isActive = false;
        };
    }, [isValidTokenFormat, token]);

    const renderContent = () => {
        if (successMessage) {
            return (
                <div
                    className="rounded-lg border border-emerald-500/40 bg-secondary-surface p-6 shadow-2xl shadow-black/30"
                    role="status">
                    <CircleCheck
                        aria-hidden="true"
                        className="mb-4 text-emerald-400"
                        size={32}
                    />
                    <h2 className="text-2xl font-semibold text-text-primary">
                        Password updated
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-text-muted">
                        {successMessage}
                    </p>
                    <ButtonLink
                        className="mt-6"
                        fullWidth
                        to={routes.login}>
                        Continue to login
                    </ButtonLink>
                </div>
            );
        }

        if (displayedTokenStatus === "verifying") {
            return (
                <div
                    className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-border-divider bg-secondary-surface p-6 text-center shadow-2xl shadow-black/30"
                    role="status">
                    <Loader2
                        aria-hidden="true"
                        className="animate-spin text-accent"
                        size={28}
                    />
                    <p className="mt-4 text-sm text-text-muted">
                        Verifying your reset link...
                    </p>
                </div>
            );
        }

        if (displayedTokenStatus === "expired") {
            return (
                <div
                    className="rounded-lg border border-amber-500/40 bg-secondary-surface p-6 shadow-2xl shadow-black/30"
                    role="alert">
                    <Clock3
                        aria-hidden="true"
                        className="mb-4 text-amber-400"
                        size={32}
                    />
                    <h2 className="text-2xl font-semibold text-text-primary">
                        Reset password link has expired
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-text-muted">
                        Request a new link to continue resetting your password.
                    </p>
                    <ButtonLink
                        className="mt-6"
                        fullWidth
                        to={routes.forgotPassword}>
                        Request a new link
                    </ButtonLink>
                </div>
            );
        }

        return (
            <ResetPasswordForm
                onSuccess={setSuccessMessage}
                token={token}
            />
        );
    };

    return (
        <main className="min-h-screen bg-primary-background text-text-primary">
            <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <Logo />
                </header>

                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
                    <div className="mx-auto w-full max-w-md md:mx-0">
                        {renderContent()}
                    </div>

                    <div className="hidden md:block">
                        <AuthBrandPanel mode="reset-password" />
                    </div>
                </div>
            </section>
        </main>
    );
}
