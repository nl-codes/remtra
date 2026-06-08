import { Navigate, Outlet, useLocation } from "react-router-dom";
import { routes } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import RouteLoading from "./RouteLoading";

export default function ProtectedRoute() {
    const { status } = useAuth();
    const location = useLocation();

    if (status === "checking") {
        return <RouteLoading />;
    }

    if (status === "unauthenticated") {
        return (
            <Navigate
                replace
                state={{ from: location.pathname }}
                to={routes.login}
            />
        );
    }

    return <Outlet />;
}
