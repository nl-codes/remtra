import { Navigate, Outlet } from "react-router-dom";
import { routes } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import RouteLoading from "./RouteLoading";

export default function GuestOnlyRoute() {
    const { status } = useAuth();

    if (status === "checking") {
        return <RouteLoading />;
    }

    if (status === "authenticated") {
        return <Navigate replace to={routes.dashboard} />;
    }

    return <Outlet />;
}
