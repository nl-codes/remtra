import { Loader2 } from "lucide-react";

export default function RouteLoading() {
    return (
        <main
            className="flex min-h-screen items-center justify-center bg-primary-background text-text-primary"
            role="status">
            <div className="flex items-center gap-3 text-sm text-text-muted">
                <Loader2
                    aria-hidden="true"
                    className="animate-spin text-accent"
                    size={22}
                />
                Checking your session...
            </div>
        </main>
    );
}
