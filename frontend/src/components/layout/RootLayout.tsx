import { Outlet } from "react-router-dom";
import Header from "../common/Header";

export const RootLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-primary-background text-text-primary">
            <Header />

            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};
