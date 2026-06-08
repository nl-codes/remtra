import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";
import { routes } from "../../constants/routes";

export default function Logo() {
    return (
        <Link
            to={routes.dashboard}
            className="inline-block transition-opacity hover:opacity-80">
            <img
                src={logo}
                width={80}
                height={80}
                alt="RemTra Logo"
                className="h-auto w-20"
            />
        </Link>
    );
}
