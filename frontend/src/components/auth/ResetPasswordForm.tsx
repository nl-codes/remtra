import { AxiosError } from "axios";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { type ChangeEvent, type SubmitEventHandler, useState } from "react";
import { appToast } from "../../lib/toast";
import {
    resetPasswordFormSchema,
    type ResetPasswordFormValues,
} from "../../schemas/auth.schema";
import { resetPassword } from "../../services/auth.api";
import type { ApiResponse } from "../../types/api";
import FormInput from "./FormInput";

interface ResetPasswordFormProps {
    token: string;
    onSuccess: (message: string) => void;
}

type ResetPasswordField = keyof ResetPasswordFormValues;
type FormErrors = Partial<Record<ResetPasswordField, string>>;

const initialFormValues: ResetPasswordFormValues = {
    newPassword: "",
    confirmPassword: "",
};

const getApiErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const response = error.response?.data as ApiResponse<void> | undefined;

        return response?.message ?? "Unable to reset password. Please try again.";
    }

    return "Unable to reset password. Please try again.";
};

export default function ResetPasswordForm({
    token,
    onSuccess,
}: ResetPasswordFormProps) {
    const [formValues, setFormValues] =
        useState<ResetPasswordFormValues>(initialFormValues);
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const field = event.target.name as ResetPasswordField;

        setFormValues((currentValues) => ({
            ...currentValues,
            [field]: event.target.value,
        }));
        setFieldErrors((currentErrors) => ({
            ...currentErrors,
            [field]: undefined,
        }));
        setServerError("");
    };

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setFieldErrors({});
        setServerError("");

        const parsedForm = resetPasswordFormSchema.safeParse(formValues);

        if (!parsedForm.success) {
            const errors = parsedForm.error.issues.reduce<FormErrors>(
                (currentErrors, issue) => {
                    const field = issue.path[0];

                    if (
                        field === "newPassword" ||
                        field === "confirmPassword"
                    ) {
                        currentErrors[field] = issue.message;
                    }

                    return currentErrors;
                },
                {},
            );

            setFieldErrors(errors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await resetPassword({
                token,
                newPassword: parsedForm.data.newPassword,
            });

            appToast.success(response.message);
            onSuccess(response.message);
        } catch (error) {
            const message = getApiErrorMessage(error);

            setServerError(message);
            appToast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const passwordToggle = (
        isVisible: boolean,
        toggle: () => void,
        label: string,
    ) => (
        <button
            aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-text-muted transition hover:bg-secondary-surface hover:text-text-primary"
            onClick={toggle}
            type="button">
            {isVisible ? (
                <EyeOff aria-hidden="true" size={18} />
            ) : (
                <Eye aria-hidden="true" size={18} />
            )}
        </button>
    );

    return (
        <div className="rounded-lg border border-border-divider bg-secondary-surface p-5 shadow-2xl shadow-black/30 sm:p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-text-primary">
                    Choose a new password
                </h2>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                    Use at least 8 characters and keep it different from your
                    previous password.
                </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <FormInput
                    autoComplete="new-password"
                    error={fieldErrors.newPassword}
                    icon={<Lock aria-hidden="true" size={18} />}
                    label="New password"
                    name="newPassword"
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    trailingAction={passwordToggle(
                        showNewPassword,
                        () => setShowNewPassword((isVisible) => !isVisible),
                        "new password",
                    )}
                    type={showNewPassword ? "text" : "password"}
                    value={formValues.newPassword}
                />

                <FormInput
                    autoComplete="new-password"
                    error={fieldErrors.confirmPassword}
                    icon={<Lock aria-hidden="true" size={18} />}
                    label="Confirm new password"
                    name="confirmPassword"
                    onChange={handleChange}
                    placeholder="Enter the password again"
                    trailingAction={passwordToggle(
                        showConfirmPassword,
                        () => setShowConfirmPassword((isVisible) => !isVisible),
                        "confirmed password",
                    )}
                    type={showConfirmPassword ? "text" : "password"}
                    value={formValues.confirmPassword}
                />

                {serverError ? (
                    <div
                        className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                        role="alert">
                        {serverError}
                    </div>
                ) : null}

                <button
                    className="flex h-11 w-full items-center justify-center rounded-md bg-action px-4 text-sm font-semibold text-primary-background transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isSubmitting}
                    type="submit">
                    {isSubmitting ? (
                        <Loader2
                            aria-hidden="true"
                            className="animate-spin"
                            size={18}
                        />
                    ) : (
                        "Reset password"
                    )}
                </button>
            </form>
        </div>
    );
}
