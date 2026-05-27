import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./constants/routes";
import RegisterPage from "./pages/RegisterPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={routes.register} replace />} />
            <Route path={routes.register} element={<RegisterPage />} />
        </Routes>
    );
}

export default App;
