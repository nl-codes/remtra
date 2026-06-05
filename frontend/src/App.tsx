import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./constants/routes";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ToastProvider from "./components/common/ToastProvider";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to={routes.register} replace />}
                />
                <Route path={routes.register} element={<RegisterPage />} />
                <Route path={routes.login} element={<LoginPage />} />
                <Route
                    path={routes.forgotPassword}
                    element={<ForgotPasswordPage />}
                />
                <Route
                    path={routes.resetPassword}
                    element={<ResetPasswordPage />}
                />
            </Routes>
            <ToastProvider />
        </>
    );
}

export default App;
