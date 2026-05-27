import AuthBrandPanel from "../components/auth/AuthBrandPanel";
import RegisterForm from "../components/auth/RegisterForm";

function RegisterPage() {
    return (
        <main className="min-h-screen bg-primary-background px-4 py-8 font-jetbrains text-text-primary sm:px-6 lg:px-8">
            <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
                <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px] lg:gap-12">
                    <AuthBrandPanel />
                    <RegisterForm />
                </div>
            </section>
        </main>
    );
}

export default RegisterPage;
