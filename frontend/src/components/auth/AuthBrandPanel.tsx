interface AuthBrandPanelProps {
    mode: "register" | "login" | "forgot-password" | "reset-password";
}

function AuthBrandPanel({ mode }: AuthBrandPanelProps) {
    const isRegister = mode === "register";
    const isForgotPassword = mode === "forgot-password";
    const isResetPassword = mode === "reset-password";

    const title = isResetPassword
        ? "Set a new password. Keep everything else moving."
        : isForgotPassword
        ? "A missed password should not cost you your history."
        : isRegister
          ? "Remember when it happened. Keep today from drifting."
          : "Welcome back. Pick up right where you left off.";

    const description = isResetPassword
        ? "Choose a secure password for your RemTra account, then return to the habits and moments you are tracking."
        : isForgotPassword
        ? "Request a secure reset link and get back to the habits and moments you have been keeping track of."
        : isRegister
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
