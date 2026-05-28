interface AuthBrandPanelProps {
    mode: "register" | "login";
}

function AuthBrandPanel({ mode }: AuthBrandPanelProps) {
    const isRegister = mode === "register";

    const title = isRegister
        ? "Remember when it happened. Keep today from drifting."
        : "Welcome back. Pick up right where you left off.";

    const description = isRegister
        ? "Create your account to start tracking habits, daily activity, and the small life events that are too easy to lose to time."
        : "Sign in to your account to continue tracking your habits and moments that matter.";

    return (
        <div className="flex flex-col justify-center">
            <h1 className="max-w-2xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl">
                {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-text-muted sm:text-lg">
                {description}
            </p>
        </div>
    );
}

export default AuthBrandPanel;
