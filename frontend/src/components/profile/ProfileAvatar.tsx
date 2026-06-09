import { UserRound } from "lucide-react";

interface ProfileAvatarProps {
    name: string;
    pictureUrl?: string;
    size?: "small" | "large";
}

const sizeClasses = {
    small: "h-10 w-10",
    large: "h-24 w-24 sm:h-28 sm:w-28",
} as const;

export default function ProfileAvatar({
    name,
    pictureUrl,
    size = "large",
}: ProfileAvatarProps) {
    return (
        <div
            className={`${sizeClasses[size]} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-divider bg-primary-background text-text-muted`}>
            <UserRound
                aria-hidden="true"
                className={size === "large" ? "h-10 w-10" : "h-5 w-5"}
            />
            {pictureUrl ? (
                <img
                    alt={`${name}'s profile`}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(event) => {
                        event.currentTarget.hidden = true;
                    }}
                    src={pictureUrl}
                />
            ) : null}
        </div>
    );
}
