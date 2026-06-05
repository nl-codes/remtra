import AuthBrandPanel from "../components/auth/AuthBrandPanel";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import Logo from "../components/common/Logo";

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen bg-primary-background text-text-primary">
            <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <Logo />
                </header>

                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
                    <div className="mx-auto w-full max-w-md md:mx-0">
                        <ForgotPasswordForm />
                    </div>

                    <div className="hidden md:block">
                        <AuthBrandPanel mode="forgot-password" />
                    </div>
                </div>
            </section>
        </main>
    );
}
