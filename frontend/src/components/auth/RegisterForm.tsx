import { AxiosError } from "axios";
import { Eye, EyeOff, Loader2, Lock, Mail, UserRound } from "lucide-react";
import { type ChangeEvent, type SubmitEvent, useState } from "react";
import { ZodError } from "zod";
import {
    registerFormSchema,
    type RegisterFormValues,
} from "../../schemas/auth.schema";
import { registerUser } from "../../services/auth.api";
import type { ApiResponse } from "../../types/api";
import type { RegisterResponse } from "../../types/auth";
import FormInput from "./FormInput";
import { Link } from "react-router-dom";
import { routes } from "../../constants/routes";

type RegisterField = keyof RegisterFormValues;
type FormErrors = Partial<Record<RegisterField, string>>;

const initialFormValues: RegisterFormValues = {
    username: "",
    email: "",
    password: "",
};

const getApiErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const response = error.response?.data as
            | ApiResponse<RegisterResponse>
            | undefined;

        return response?.message ?? "Registration failed. Please try again.";
    }

    return "Registration failed. Please try again.";
};

const getValidationErrors = (
    error: ZodError<RegisterFormValues>,
): FormErrors => {
    return error.issues.reduce<FormErrors>((errors, issue) => {
        const field = issue.path[0];

        if (field === "username" || field === "email" || field === "password") {
            errors[field] = issue.message;
        }

        return errors;
    }, {});
};

function RegisterForm() {
    const [formValues, setFormValues] =
        useState<RegisterFormValues>(initialFormValues);
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState("");
    const [registeredUser, setRegisteredUser] = useState<
        RegisterResponse["user"] | null
    >(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;

        setFormValues((currentValues) => ({
            ...currentValues,
            [name]: value,
        }));
        setFieldErrors((currentErrors) => ({
            ...currentErrors,
            [name]: undefined,
        }));
        setServerError("");
    };

    const handleSubmit = async (
        event: SubmitEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();
        setServerError("");
        setRegisteredUser(null);

        const parsedForm = registerFormSchema.safeParse(formValues);

        if (!parsedForm.success) {
            setFieldErrors(getValidationErrors(parsedForm.error));
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await registerUser(parsedForm.data);

            if (response.data) {
                setRegisteredUser(response.data.user);
                setFormValues(initialFormValues);
            }
        } catch (error) {
            setServerError(getApiErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rounded-lg border border-border-divider bg-secondary-surface p-5 shadow-2xl shadow-black/30 sm:p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-text-primary">
                    Create account
                </h2>
                <p className="hidden md:block mt-2 text-sm text-text-muted">
                    Start with a username, email, and secure password.
                </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <FormInput
                    error={fieldErrors.username}
                    icon={<UserRound aria-hidden="true" size={18} />}
                    label="Username"
                    name="username"
                    onChange={handleChange}
                    placeholder="narayan"
                    type="text"
                    value={formValues.username}
                />

                <FormInput
                    error={fieldErrors.email}
                    icon={<Mail aria-hidden="true" size={18} />}
                    label="Email"
                    name="email"
                    onChange={handleChange}
                    placeholder="you@example.com"
                    type="email"
                    value={formValues.email}
                />

                <FormInput
                    error={fieldErrors.password}
                    icon={<Lock aria-hidden="true" size={18} />}
                    label="Password"
                    name="password"
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    trailingAction={
                        <button
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-text-muted transition hover:bg-secondary-surface hover:text-text-primary"
                            onClick={() =>
                                setShowPassword((currentValue) => !currentValue)
                            }
                            type="button">
                            {showPassword ? (
                                <EyeOff aria-hidden="true" size={18} />
                            ) : (
                                <Eye aria-hidden="true" size={18} />
                            )}
                        </button>
                    }
                    type={showPassword ? "text" : "password"}
                    value={formValues.password}
                />

                {serverError ? (
                    <div className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        {serverError}
                    </div>
                ) : null}

                {registeredUser ? (
                    <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-yellow-100">
                        Account created for {registeredUser.username}.
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
                        "Create account"
                    )}
                </button>
                <p className="text-center text-text-muted underline">
                    <Link to={routes.login}>Log in to existing account</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterForm;
