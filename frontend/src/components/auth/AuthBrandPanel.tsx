import logo from "../../assets/Logo.png";
function AuthBrandPanel() {
    return (
        <div className="flex flex-col justify-center">
            <img src={logo} width={80} />

            <h1 className="max-w-2xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl">
                Remember when it happened. Keep today from drifting.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-text-muted sm:text-lg">
                Create your account to start tracking habits, daily activity,
                and the small life events that are too easy to lose to time.
            </p>
        </div>
    );
}

export default AuthBrandPanel;
