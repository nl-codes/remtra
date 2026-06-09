import { AxiosError } from "axios";
import {
    CalendarDays,
    Loader2,
    MapPin,
    Pencil,
    Trash2,
    UserRoundPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { routes } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import { appToast } from "../lib/toast";
import { deleteProfile, getMyProfile } from "../services/profile.api";
import type { ApiResponse } from "../types/api";
import type { Profile } from "../types/profile";
import Button, { ButtonLink } from "../components/common/Button";
import ProfileAvatar from "../components/profile/ProfileAvatar";

type PageStatus = "loading" | "ready" | "missing" | "error";

const getApiErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const response = error.response?.data as
            | ApiResponse<Profile>
            | undefined;

        return response?.message ?? "Unable to load your profile.";
    }

    return "Unable to load your profile.";
};

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [status, setStatus] = useState<PageStatus>("loading");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadProfile = async (): Promise<void> => {
        setStatus("loading");

        try {
            const response = await getMyProfile();

            if (response.data) {
                setProfile(response.data);
                setStatus("ready");
                return;
            }

            setStatus("error");
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
                setProfile(null);
                setStatus("missing");
                return;
            }

            setStatus("error");
        }
    };

    useEffect(() => {
        let isActive = true;

        void getMyProfile()
            .then((response) => {
                if (!isActive) {
                    return;
                }

                if (response.data) {
                    setProfile(response.data);
                    setStatus("ready");
                    return;
                }

                setStatus("error");
            })
            .catch((error: unknown) => {
                if (!isActive) {
                    return;
                }

                if (
                    error instanceof AxiosError &&
                    error.response?.status === 404
                ) {
                    setProfile(null);
                    setStatus("missing");
                    return;
                }

                setStatus("error");
            });

        return () => {
            isActive = false;
        };
    }, []);

    const handleDelete = async (): Promise<void> => {
        if (isDeleting) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await deleteProfile();

            setProfile(null);
            setStatus("missing");
            setShowDeleteConfirmation(false);
            appToast.success(response.message);
        } catch (error) {
            appToast.error(getApiErrorMessage(error));
        } finally {
            setIsDeleting(false);
        }
    };

    const displayName = profile
        ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
          user?.username ||
          "RemTra user"
        : user?.username || "RemTra user";

    return (
        <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-6">
                <p className="text-sm font-medium text-accent">Your account</p>
                <h1 className="mt-1 text-2xl font-semibold text-text-primary sm:text-3xl">
                    Profile
                </h1>
            </header>

            {status === "loading" ? (
                <div
                    className="flex min-h-72 items-center justify-center rounded-lg border border-border-divider bg-secondary-surface"
                    role="status">
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                        <Loader2
                            aria-hidden="true"
                            className="animate-spin text-accent"
                            size={22}
                        />
                        Loading your profile...
                    </div>
                </div>
            ) : null}

            {status === "error" ? (
                <div className="rounded-lg border border-border-divider bg-secondary-surface p-6 text-center">
                    <h2 className="text-lg font-semibold text-text-primary">
                        Your profile could not be loaded
                    </h2>
                    <p className="mt-2 text-sm text-text-muted">
                        Check your connection and try again.
                    </p>
                    <Button className="mt-5" onClick={() => void loadProfile()}>
                        Try again
                    </Button>
                </div>
            ) : null}

            {status === "missing" ? (
                <div className="rounded-lg border border-border-divider bg-secondary-surface px-5 py-10 text-center sm:px-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border-divider bg-primary-background text-accent">
                        <UserRoundPlus aria-hidden="true" size={26} />
                    </div>
                    <h2 className="mt-5 text-xl font-semibold text-text-primary">
                        Create your public profile
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
                        Add a name, photo, and a few details so people can
                        recognize you across RemTra.
                    </p>
                    <ButtonLink
                        className="mt-6"
                        icon={<UserRoundPlus aria-hidden="true" />}
                        to={routes.editProfile}
                        variant="secondary">
                        Create profile
                    </ButtonLink>
                </div>
            ) : null}

            {status === "ready" && profile ? (
                <article className="overflow-hidden rounded-lg border border-border-divider bg-secondary-surface">
                    <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
                        <ProfileAvatar
                            name={displayName}
                            pictureUrl={profile.pictureUrl}
                        />
                        <div className="min-w-0 flex-1">
                            <h2 className="wrap-break-word text-2xl font-semibold text-text-primary">
                                {displayName}
                            </h2>
                            <p className="mt-1 break-all text-sm text-text-muted">
                                @{user?.username}
                            </p>
                            {profile.bio ? (
                                <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-slate-300">
                                    {profile.bio}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <dl className="grid border-y border-border-divider sm:grid-cols-2">
                        <div className="flex gap-3 px-5 py-4 sm:border-r sm:border-border-divider sm:px-7">
                            <MapPin
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 text-accent"
                                size={18}
                            />
                            <div>
                                <dt className="text-xs uppercase text-text-muted">
                                    Location
                                </dt>
                                <dd className="mt-1 text-sm text-text-primary">
                                    {profile.country || "Not added"}
                                </dd>
                            </div>
                        </div>
                        <div className="flex gap-3 border-t border-border-divider px-5 py-4 sm:border-t-0 sm:px-7">
                            <CalendarDays
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 text-accent"
                                size={18}
                            />
                            <div>
                                <dt className="text-xs uppercase text-text-muted">
                                    Profile created
                                </dt>
                                <dd className="mt-1 text-sm text-text-primary">
                                    {new Intl.DateTimeFormat(undefined, {
                                        dateStyle: "medium",
                                    }).format(new Date(profile.createdAt))}
                                </dd>
                            </div>
                        </div>
                    </dl>

                    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                        <ButtonLink
                            icon={<Pencil aria-hidden="true" />}
                            to={routes.editProfile}
                            variant="secondary">
                            Edit profile
                        </ButtonLink>
                        <Button
                            icon={<Trash2 aria-hidden="true" />}
                            onClick={() => setShowDeleteConfirmation(true)}
                            variant="tertiary">
                            Delete profile
                        </Button>
                    </div>

                    {showDeleteConfirmation ? (
                        <div
                            className="border-t border-red-400/30 bg-red-500/10 p-5 sm:p-7"
                            role="alert">
                            <h3 className="font-semibold text-red-100">
                                Delete your profile?
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-red-100/80">
                                This removes your public profile details. Your
                                RemTra account will remain active.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Button
                                    disabled={isDeleting}
                                    onClick={() =>
                                        setShowDeleteConfirmation(false)
                                    }
                                    variant="secondary">
                                    Cancel
                                </Button>
                                <Button
                                    disabled={isDeleting}
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
                                    onClick={() => void handleDelete()}>
                                    {isDeleting
                                        ? "Deleting..."
                                        : "Delete profile"}
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </article>
            ) : null}
        </section>
    );
}
