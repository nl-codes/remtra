import { AxiosError } from "axios";
import { ArrowLeft, CircleCheck, Loader2, Mail } from "lucide-react";
import { type ChangeEvent, type SubmitEventHandler, useState } from "react";
import { routes } from "../../constants/routes";
import { appToast } from "../../lib/toast";
import {
    forgotPasswordFormSchema,
    type ForgotPasswordFormValues,
} from "../../schemas/auth.schema";
import { forgotPassword } from "../../services/auth.api";
import type { ApiResponse } from "../../types/api";
import FormInput from "./FormInput";
import Button, { ButtonLink } from "../common/Button";

const initialFormValues: ForgotPasswordFormValues = {
    email: "",
};

const getApiErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const response = error.response?.data as ApiResponse<void> | undefined;

        return (
            response?.message ??
            "Unable to send the reset link. Please try again."
        );
    }

    return "Unable to send the reset link. Please try again.";
};

export default function ForgotPasswordForm() {
    const [formValues, setFormValues] =
        useState<ForgotPasswordFormValues>(initialFormValues);
    const [emailError, setEmailError] = useState("");
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setFormValues({ email: event.target.value });
        setEmailError("");
        setServerError("");
        setSuccessMessage("");
    };

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setEmailError("");
        setServerError("");
        setSuccessMessage("");

        const parsedForm = forgotPasswordFormSchema.safeParse(formValues);

        if (!parsedForm.success) {
            setEmailError(
                parsedForm.error.issues[0]?.message ?? "Invalid email",
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await forgotPassword(parsedForm.data);

            setSuccessMessage(response.message);
            setFormValues(initialFormValues);
        } catch (error) {
            const message = getApiErrorMessage(error);

            setServerError(message);
            appToast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rounded-lg border border-border-divider bg-secondary-surface p-5 shadow-2xl shadow-black/30 sm:p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-text-primary">
                    Reset your password
                </h2>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                    Enter your account email and we will send you a secure reset
                    link.
                </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <FormInput
                    autoComplete="email"
                    error={emailError}
                    icon={<Mail aria-hidden="true" size={18} />}
                    label="Email"
                    name="email"
                    onChange={handleChange}
                    placeholder="you@example.com"
                    type="email"
                    value={formValues.email}
                />

                {serverError ? (
                    <div
                        className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                        role="alert">
                        {serverError}
                    </div>
                ) : null}

                {successMessage ? (
                    <div
                        className="flex gap-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-3 text-sm leading-6 text-emerald-100"
                        role="status">
                        <CircleCheck
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-emerald-400"
                            size={18}
                        />
                        <span>{successMessage}</span>
                    </div>
                ) : null}

                <Button
                    disabled={isSubmitting}
                    fullWidth
                    icon={
                        isSubmitting ? (
                            <Loader2
                                aria-hidden="true"
                                className="animate-spin"
                            />
                        ) : undefined
                    }
                    type="submit">
                    {isSubmitting ? "Sending link..." : "Send reset link"}
                </Button>

                <ButtonLink
                    className="mx-auto"
                    icon={<ArrowLeft aria-hidden="true" />}
                    to={routes.login}
                    variant="tertiary">
                    Back to login
                </ButtonLink>
            </form>
        </div>
    );
}
