import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./constants/routes";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ToastProvider from "./components/common/ToastProvider";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { RootLayout } from "./components/layout/RootLayout";
import DashboardPage from "./pages/DashboardPage";
import GuestOnlyRoute from "./components/routing/GuestOnlyRoute";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import SharedRoute from "./components/routing/SharedRoute";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to={routes.dashboard} replace />}
                />

                <Route element={<GuestOnlyRoute />}>
                    <Route path={routes.register} element={<RegisterPage />} />
                    <Route path={routes.login} element={<LoginPage />} />
                    <Route
                        path={routes.forgotPassword}
                        element={<ForgotPasswordPage />}
                    />
                </Route>

                <Route element={<SharedRoute />}>
                    <Route
                        path={routes.resetPassword}
                        element={<ResetPasswordPage />}
                    />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route element={<RootLayout />}>
                        <Route
                            path={routes.dashboard}
                            element={<DashboardPage />}
                        />
                        <Route
                            path={routes.profile}
                            element={<ProfilePage />}
                        />
                        <Route
                            path={routes.editProfile}
                            element={<ProfileEditPage />}
                        />
                        <Route
                            path={routes.settings}
                            element={<SettingsPage />}
                        />
                    </Route>
                </Route>
            </Routes>
            <ToastProvider />
        </>
    );
}

export default App;
