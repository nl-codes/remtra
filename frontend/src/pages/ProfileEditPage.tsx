import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import ProfileForm from "../components/profile/ProfileForm";
import { getMyProfile } from "../services/profile.api";
import type { Profile } from "../types/profile";

type PageStatus = "loading" | "ready" | "error";

export default function ProfileEditPage() {
    const [profile, setProfile] = useState<Profile | undefined>();
    const [status, setStatus] = useState<PageStatus>("loading");

    useEffect(() => {
        let isActive = true;

        void getMyProfile()
            .then((response) => {
                if (!isActive) {
                    return;
                }

                setProfile(response.data);
                setStatus("ready");
            })
            .catch((error: unknown) => {
                if (!isActive) {
                    return;
                }

                if (
                    error instanceof AxiosError &&
                    error.response?.status === 404
                ) {
                    setProfile(undefined);
                    setStatus("ready");
                    return;
                }

                setStatus("error");
            });

        return () => {
            isActive = false;
        };
    }, []);

    return (
        <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-6">
                <p className="text-sm font-medium text-accent">Your account</p>
                <h1 className="mt-1 text-2xl font-semibold text-text-primary sm:text-3xl">
                    {profile ? "Edit profile" : "Create profile"}
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
                        Preparing your profile...
                    </div>
                </div>
            ) : null}

            {status === "error" ? (
                <div
                    className="rounded-lg border border-red-400/40 bg-red-500/10 p-5 text-sm text-red-100"
                    role="alert">
                    Unable to prepare the profile form. Please return to your
                    profile and try again.
                </div>
            ) : null}

            {status === "ready" ? (
                <div className="rounded-lg border border-border-divider bg-secondary-surface p-5 shadow-2xl shadow-black/20 sm:p-7">
                    <ProfileForm profile={profile} />
                </div>
            ) : null}
        </section>
    );
}
