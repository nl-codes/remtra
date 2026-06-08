import { AxiosError } from "axios";
import { Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { type ChangeEvent, type SubmitEventHandler, useState } from "react";
import { ZodError } from "zod";
import {
    loginFormSchema,
    type LoginFormValues,
} from "../../schemas/auth.schema";
import { loginUser } from "../../services/auth.api";
import type { ApiResponse } from "../../types/api";
import type { LoginResponse } from "../../types/auth";
import FormInput from "./FormInput";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";
import { appToast } from "../../lib/toast";
import { useAuth } from "../../hooks/useAuth";
import Button, { ButtonLink } from "../common/Button";

type LoginField = keyof LoginFormValues;
type FormErrors = Partial<Record<LoginField, string>>;

const initialFormValues: LoginFormValues = {
    identifier: "",
    password: "",
};

const getApiErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const response = error.response?.data as
            | ApiResponse<LoginResponse>
            | undefined;

        return response?.message ?? "Login failed. Please try again.";
    }

    return "Login failed. Please try again.";
};

const getValidationErrors = (error: ZodError<LoginFormValues>): FormErrors => {
    return error.issues.reduce<FormErrors>((errors, issue) => {
        const field = issue.path[0];

        if (field === "identifier" || field === "password") {
            errors[field] = issue.message;
        }

        return errors;
    }, {});
};

export default function LoginForm() {
    const [formValues, setFormValues] =
        useState<LoginFormValues>(initialFormValues);
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { setAuthenticated } = useAuth();

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

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setServerError("");

        const parsedForm = loginFormSchema.safeParse(formValues);

        if (!parsedForm.success) {
            setFieldErrors(getValidationErrors(parsedForm.error));
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await loginUser(parsedForm.data);

            if (response.data) {
                setAuthenticated(response.data.user);
                appToast.success("Logged in successfully");
                navigate(routes.dashboard, { replace: true });
            }
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
                    Log in
                </h2>
                <p className="hidden md:block mt-2 text-sm text-text-muted">
                    Enter your identifier and password.
                </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <FormInput
                    error={fieldErrors.identifier}
                    icon={<User aria-hidden="true" size={18} />}
                    label="Email or Username"
                    name="identifier"
                    onChange={handleChange}
                    placeholder="myusername or my@email.com"
                    type="text"
                    autoComplete="username"
                    value={formValues.identifier}
                />

                <FormInput
                    error={fieldErrors.password}
                    icon={<Lock aria-hidden="true" size={18} />}
                    label="Password"
                    name="password"
                    onChange={handleChange}
                    placeholder="********"
                    autoComplete="current-password"
                    trailingAction={
                        <Button
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            icon={
                                showPassword ? (
                                    <EyeOff aria-hidden="true" />
                                ) : (
                                    <Eye aria-hidden="true" />
                                )
                            }
                            iconOnly
                            onClick={() =>
                                setShowPassword((currentValue) => !currentValue)
                            }
                            variant="tertiary"
                        />
                    }
                    type={showPassword ? "text" : "password"}
                    value={formValues.password}
                />

                {serverError ? (
                    <div className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        {serverError}
                    </div>
                ) : null}

                <div className="flex justify-end">
                    <ButtonLink
                        replace
                        to={routes.forgotPassword}
                        variant="tertiary">
                        Forgot Password?
                    </ButtonLink>
                </div>
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
                    {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <div className="flex justify-center">
                    <ButtonLink
                        replace
                        to={routes.register}
                        variant="tertiary">
                        Sign up instead
                    </ButtonLink>
                </div>
            </form>
        </div>
    );
}
