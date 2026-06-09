import { AxiosError } from "axios";
import { AlignLeft, Flag, Image, Loader2, UserRound } from "lucide-react";
import {
    type ChangeEvent,
    type SubmitEventHandler,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { ZodError } from "zod";
import { routes } from "../../constants/routes";
import { notifyProfileChanged } from "../../lib/profile-events";
import { appToast } from "../../lib/toast";
import {
    profileFormSchema,
    type ProfileFormValues,
} from "../../schemas/profile.schema";
import {
    createProfile,
    updateProfile,
    updateProfilePicture,
} from "../../services/profile.api";
import type { ApiResponse } from "../../types/api";
import type {
    CreateProfileRequest,
    Profile,
    ProfileGender,
    UpdateProfileRequest,
} from "../../types/profile";
import FormInput from "../auth/FormInput";
import Button, { ButtonLink } from "../common/Button";
import UserAvatar from "./UserAvatar";

type ProfileField = keyof ProfileFormValues;
type FormErrors = Partial<Record<ProfileField, string>>;

interface ProfileFormProps {
    profile?: Profile;
}

const emptyFormValues: ProfileFormValues = {
    firstName: "",
    lastName: "",
    pictureUrl: "",
    bio: "",
    gender: "",
    country: "",
};

const getInitialValues = (profile?: Profile): ProfileFormValues => ({
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    pictureUrl: profile?.pictureUrl ?? "",
    bio: profile?.bio ?? "",
    gender: profile?.gender ?? "",
    country: profile?.country ?? "",
});

const getValidationErrors = (
    error: ZodError<ProfileFormValues>,
): FormErrors => {
    return error.issues.reduce<FormErrors>((errors, issue) => {
        const field = issue.path[0];

        if (typeof field === "string" && field in emptyFormValues) {
            errors[field as ProfileField] = issue.message;
        }

        return errors;
    }, {});
};

const getApiErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const response = error.response?.data as
            | ApiResponse<Profile>
            | undefined;

        return response?.message ?? "Unable to save your profile.";
    }

    return "Unable to save your profile.";
};

const compactProfilePayload = (
    values: ProfileFormValues,
): CreateProfileRequest => {
    return {
        ...compactProfileDetails(values),
        pictureUrl: values.pictureUrl || undefined,
    };
};

const compactProfileDetails = (
    values: ProfileFormValues,
): UpdateProfileRequest => {
    const gender =
        values.gender === "" ? undefined : (values.gender as ProfileGender);

    return {
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
        bio: values.bio || undefined,
        gender,
        country: values.country || undefined,
    };
};

export default function ProfileForm({ profile }: ProfileFormProps) {
    const navigate = useNavigate();
    const initialValues = useMemo(() => getInitialValues(profile), [profile]);
    const [formValues, setFormValues] =
        useState<ProfileFormValues>(initialValues);
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = Boolean(profile);

    const displayName =
        [formValues.firstName, formValues.lastName].filter(Boolean).join(" ") ||
        "Your profile";

    const handleChange = (
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ): void => {
        const field = event.target.name as ProfileField;

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
        setServerError("");

        const parsedForm = profileFormSchema.safeParse(formValues);

        if (!parsedForm.success) {
            setFieldErrors(getValidationErrors(parsedForm.error));
            return;
        }

        setFieldErrors({});
        setIsSubmitting(true);

        try {
            if (!profile) {
                const response = await createProfile(
                    compactProfilePayload(parsedForm.data),
                );

                notifyProfileChanged();
                appToast.success(response.message);
                navigate(routes.profile, { replace: true });
                return;
            }

            const details = compactProfileDetails(parsedForm.data);

            const detailsChanged = (
                ["firstName", "lastName", "bio", "gender", "country"] as const
            ).some(
                (field) =>
                    (parsedForm.data[field] || undefined) !== profile[field],
            );
            const pictureChanged =
                (parsedForm.data.pictureUrl || undefined) !==
                profile.pictureUrl;

            if (!detailsChanged && !pictureChanged) {
                appToast.info("No profile changes to save");
                navigate(routes.profile);
                return;
            }

            if (detailsChanged && Object.values(details).some(Boolean)) {
                await updateProfile(details);
            }

            if (pictureChanged) {
                await updateProfilePicture({
                    pictureUrl: parsedForm.data.pictureUrl || null,
                });
            }

            notifyProfileChanged();
            appToast.success("Profile updated successfully");
            navigate(routes.profile, { replace: true });
        } catch (error) {
            const message = getApiErrorMessage(error);

            setServerError(message);
            appToast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-6" noValidate onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 border-b border-border-divider pb-6 sm:flex-row sm:items-center">
                <UserAvatar
                    className="ring-1 ring-border-divider"
                    name={displayName}
                    size="large"
                    src={formValues.pictureUrl || undefined}
                />
                <div>
                    <h2 className="text-lg font-semibold text-text-primary">
                        {isEditing ? "Edit profile" : "Create profile"}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-text-muted">
                        All fields are optional. Add the details you want others
                        to see.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                    error={fieldErrors.firstName}
                    icon={<UserRound aria-hidden="true" size={18} />}
                    label="First name"
                    name="firstName"
                    onChange={handleChange}
                    placeholder="Narayan"
                    value={formValues.firstName}
                />
                <FormInput
                    error={fieldErrors.lastName}
                    icon={<UserRound aria-hidden="true" size={18} />}
                    label="Last name"
                    name="lastName"
                    onChange={handleChange}
                    placeholder="Lohani"
                    value={formValues.lastName}
                />
            </div>

            <FormInput
                error={fieldErrors.pictureUrl}
                icon={<Image aria-hidden="true" size={18} />}
                label="Profile picture URL"
                name="pictureUrl"
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
                type="url"
                value={formValues.pictureUrl}
            />

            <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                    Bio
                </span>
                <span className="relative block">
                    <AlignLeft
                        aria-hidden="true"
                        className="absolute left-3 top-3 text-text-muted"
                        size={18}
                    />
                    <textarea
                        className="min-h-28 w-full resize-y rounded-lg border border-border-divider bg-primary-background py-3 pl-10 pr-3 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                        maxLength={500}
                        name="bio"
                        onChange={handleChange}
                        placeholder="A little about you"
                        value={formValues.bio}
                    />
                </span>
                <span className="mt-2 flex justify-between gap-4 text-sm">
                    <span className="text-accent">{fieldErrors.bio}</span>
                    <span className="ml-auto text-text-muted">
                        {formValues.bio.length}/500
                    </span>
                </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">
                        Gender
                    </span>
                    <select
                        className="h-11 w-full rounded-lg border border-border-divider bg-primary-background px-3 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                        name="gender"
                        onChange={handleChange}
                        value={formValues.gender}>
                        <option value="">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                    </select>
                    {fieldErrors.gender ? (
                        <span className="mt-2 block text-sm text-accent">
                            {fieldErrors.gender}
                        </span>
                    ) : null}
                </label>

                <FormInput
                    error={fieldErrors.country}
                    icon={<Flag aria-hidden="true" size={18} />}
                    label="Country"
                    name="country"
                    onChange={handleChange}
                    placeholder="Nepal"
                    value={formValues.country}
                />
            </div>

            {serverError ? (
                <div
                    className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                    role="alert">
                    {serverError}
                </div>
            ) : null}

            <div className="flex flex-col-reverse gap-3 border-t border-border-divider pt-6 sm:flex-row sm:justify-end">
                <ButtonLink
                    className="w-full sm:w-fit"
                    to={routes.profile}
                    variant="secondary">
                    Cancel
                </ButtonLink>
                <Button
                    className="w-full sm:w-fit"
                    disabled={isSubmitting}
                    icon={
                        isSubmitting ? (
                            <Loader2
                                aria-hidden="true"
                                className="animate-spin"
                            />
                        ) : undefined
                    }
                    type="submit">
                    {isSubmitting
                        ? "Saving profile..."
                        : isEditing
                          ? "Save changes"
                          : "Create profile"}
                </Button>
            </div>
        </form>
    );
}
