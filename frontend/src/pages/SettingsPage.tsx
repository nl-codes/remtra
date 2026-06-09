import { AxiosError } from "axios";
import { Loader2, Settings, Trash2, TriangleAlert } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { routes } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import { appToast } from "../lib/toast";
import { deleteAccount } from "../services/account.api";
import type { ApiResponse } from "../types/api";

const confirmationText = "DELETE";

const getDeleteErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const response = error.response?.data as ApiResponse<void> | undefined;

        return response?.message ?? "Unable to delete your account.";
    }

    return "Unable to delete your account.";
};

export default function SettingsPage() {
    const navigate = useNavigate();
    const { clearAuth } = useAuth();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmation, setConfirmation] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const canDelete = confirmation === confirmationText && !isDeleting;

    const handleConfirmationChange = (
        event: ChangeEvent<HTMLInputElement>,
    ): void => {
        setConfirmation(event.target.value);
    };

    const handleDeleteAccount = async (): Promise<void> => {
        if (!canDelete) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await deleteAccount();

            clearAuth();
            appToast.success(response.message);
            navigate(routes.login, { replace: true });
        } catch (error) {
            appToast.error(getDeleteErrorMessage(error));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-6">
                <p className="text-sm font-medium text-accent">Your account</p>
                <h1 className="mt-1 text-2xl font-semibold text-text-primary sm:text-3xl">
                    Settings
                </h1>
            </header>

            <div className="grid overflow-hidden rounded-lg border border-border-divider bg-secondary-surface md:grid-cols-[240px_minmax(0,1fr)]">
                <aside className="border-b border-border-divider p-3 md:min-h-120 md:border-b-0 md:border-r">
                    <nav aria-label="Settings sections">
                        <button
                            aria-current="page"
                            className="flex w-full items-center gap-3 rounded-md bg-primary-background px-3 py-3 text-left text-sm font-medium text-text-primary"
                            type="button">
                            <Settings
                                aria-hidden="true"
                                className="shrink-0 text-accent"
                                size={18}
                            />
                            Delete RemTra Account
                        </button>
                    </nav>
                </aside>

                <div className="p-5 sm:p-7 lg:p-9">
                    <div className="max-w-2xl">
                        <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-950 text-red-300">
                                <TriangleAlert aria-hidden="true" size={21} />
                            </span>
                            <div>
                                <h2 className="text-xl font-semibold text-text-primary">
                                    Delete RemTra Account
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-text-muted">
                                    Permanently delete your account and
                                    everything you have created in RemTra.
                                </p>
                            </div>
                        </div>

                        <div className="mt-7 rounded-lg border border-red-900 bg-red-950/40 p-5">
                            <h3 className="font-semibold text-red-100">
                                This action cannot be undone
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-red-100/75">
                                Your profile, account credentials, password
                                reset records, and all data currently associated
                                with your RemTra account will be permanently
                                removed.
                            </p>

                            {!showConfirmation ? (
                                <Button
                                    className="mt-5"
                                    icon={<Trash2 aria-hidden="true" />}
                                    onClick={() => setShowConfirmation(true)}
                                    variant="danger">
                                    Delete account
                                </Button>
                            ) : (
                                <div className="mt-5 border-t border-red-900 pt-5">
                                    <label className="block">
                                        <span className="block text-sm font-medium text-red-100">
                                            Type{" "}
                                            <strong>{confirmationText}</strong>{" "}
                                            to confirm
                                        </span>
                                        <input
                                            autoComplete="off"
                                            className="mt-2 h-11 w-full rounded-md border border-red-800 bg-primary-background px-3 text-sm text-text-primary outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                            name="deleteConfirmation"
                                            onChange={handleConfirmationChange}
                                            spellCheck={false}
                                            value={confirmation}
                                        />
                                    </label>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <Button
                                            disabled={isDeleting}
                                            onClick={() => {
                                                setShowConfirmation(false);
                                                setConfirmation("");
                                            }}
                                            variant="secondary">
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={!canDelete}
                                            icon={
                                                isDeleting ? (
                                                    <Loader2
                                                        aria-hidden="true"
                                                        className="animate-spin"
                                                    />
                                                ) : (
                                                    <Trash2 aria-hidden="true" />
                                                )
                                            }
                                            onClick={() =>
                                                void handleDeleteAccount()
                                            }
                                            variant="danger">
                                            {isDeleting
                                                ? "Deleting everything..."
                                                : "Permanently delete account"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
