export type AvatarSize = "extraSmall" | "small" | "medium" | "large";

interface UserAvatarProps {
    src?: string | null;
    name?: string | null;
    size?: AvatarSize;
    className?: string;
}

const sizePixels: Record<AvatarSize, number> = {
    extraSmall: 24,
    small: 32,
    medium: 64,
    large: 128,
};

const avatarColors = [
    "#4F46E5",
    "#7C3AED",
    "#DB2777",
    "#059669",
    "#D97706",
    "#DC2626",
    "#0284C7",
    "#65A30D",
] as const;

const getInitials = (name: string): string => {
    const nameParts = name.trim().split(/\s+/);

    if (nameParts.length === 1) {
        return nameParts[0].slice(0, 2).toUpperCase();
    }

    const firstInitial = nameParts[0][0] ?? "";
    const lastInitial = nameParts[nameParts.length - 1][0] ?? "";

    return `${firstInitial}${lastInitial}`.toUpperCase();
};

const getAvatarColor = (name: string): string => {
    const hash = Array.from(name).reduce(
        (currentHash, character) =>
            character.charCodeAt(0) + ((currentHash << 5) - currentHash),
        0,
    );

    return avatarColors[Math.abs(hash) % avatarColors.length];
};

export default function UserAvatar({
    className = "",
    name,
    size = "medium",
    src,
}: UserAvatarProps) {
    const pixels = sizePixels[size];
    const safeName = name?.trim() || "User";
    const safeSource = src?.trim() || null;

    return (
        <span
            aria-hidden="true"
            className={`relative inline-flex shrink-0 overflow-hidden rounded-full select-none ${className}`}
            style={{ height: pixels, width: pixels }}>
            <span
                className="flex h-full w-full items-center justify-center font-bold text-white"
                style={{
                    backgroundColor: getAvatarColor(safeName),
                    fontSize: pixels / 2.5,
                }}>
                {getInitials(safeName)}
            </span>

            {safeSource ? (
                <img
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    height={pixels}
                    onError={(event) => {
                        event.currentTarget.hidden = true;
                    }}
                    src={safeSource}
                    width={pixels}
                />
            ) : null}
        </span>
    );
}
