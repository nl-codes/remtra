import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { profileChangedEvent } from "../../lib/profile-events";
import { getMyProfile } from "../../services/profile.api";
import type { Profile } from "../../types/profile";
import UserAvatar from "./UserAvatar";

export default function ProfileAvatarButton() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);

    const loadProfile = async (): Promise<void> => {
        try {
            const response = await getMyProfile();

            setProfile(response.data ?? null);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
                setProfile(null);
                return;
            }

            console.error("Unable to load profile avatar", error);
        }
    };

    useEffect(() => {
        let isActive = true;

        void getMyProfile()
            .then((response) => {
                if (isActive) {
                    setProfile(response.data ?? null);
                }
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
                    return;
                }

                console.error("Unable to load profile avatar", error);
            });

        const handleProfileChanged = (): void => {
            void loadProfile();
        };

        window.addEventListener(profileChangedEvent, handleProfileChanged);

        return () => {
            isActive = false;
            window.removeEventListener(
                profileChangedEvent,
                handleProfileChanged,
            );
        };
    }, []);

    const displayName =
        [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
        user?.username ||
        "User";

    return (
        <Link
            aria-label="View profile"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-background"
            title="View profile"
            to={routes.profile}>
            <UserAvatar
                name={displayName}
                size={48}
                src={profile?.pictureUrl}
            />
        </Link>
    );
}
