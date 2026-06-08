import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import RouteLoading from "./RouteLoading";

export default function SharedRoute() {
    const { status } = useAuth();

    if (status === "checking") {
        return <RouteLoading />;
    }

    return <Outlet />;
}
