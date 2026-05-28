import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";

export default function Logo() {
    return (
        <Link
            to="/"
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
