
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { UserCircle2 } from "lucide-react";

import Sidebar from "./components/sidebar";
import Home from "./pages/Home";

import AuthPage from "./pages/AuthPage";

import UserHomePage from "./pages/User/UserHome";
import CreateTaskPage from "./pages/User/CreateTaskPage";
import TaskDetailPage from "./pages/User/TaskDetailPage";
import DeleteTaskPage from "./pages/User/DeleteTaskPage";
import UpdateTaskPage from "./pages/User/UpdateTaskPage";

import DashboardPage from "./pages/Admin/DashboardPage";
import AssignTaskPage from "./pages/Admin/AssignTaskPage";
import { useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

function ProtectedRoute({ isLoggedIn, children }: { isLoggedIn: boolean; children: JSX.Element }) {
    if (!isLoggedIn) {
        return <Navigate to="/auth" replace />;
    }
    return children;
}

function AppLayout() {
    const { isLoggedIn } = useAuth();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user?.User?.Name || "User";

    const isAuthPage = location.pathname === "/auth";

    return (
        <div className="min-h-screen md:flex">
            {!isAuthPage && <Sidebar />}
            <div className="flex min-h-screen flex-1 flex-col bg-transparent">
                <main className="flex-1 px-4 py-5 md:px-8 md:py-7">
                    {isLoggedIn && !isAuthPage && (
                        <div className="mb-5 flex justify-end">
                            <div className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                                <UserCircle2 size={18} className="text-slate-500" />
                                <span>{userName}</span>
                            </div>
                        </div>
                    )}

                    <Routes>
                        <Route
                            path="/auth"
                            element={isLoggedIn ? <Navigate to="/userHome" replace /> : <AuthPage />}
                        />

                        <Route
                            path="/"
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/userHome"
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <UserHomePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/createTask"
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <CreateTaskPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/detailTask/:id"
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <TaskDetailPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/deleteTask/:id"
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <DeleteTaskPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/UpdateTask/:id"
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <UpdateTaskPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/assignTask"
                            element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <AssignTaskPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to={isLoggedIn ? "/userHome" : "/auth"} replace />} />
                    </Routes>
                </main>
                <footer className="border-t bg-white/90 px-4 py-4 text-center text-sm text-slate-700 md:px-8">
                    © 2026 Muhammad Hamza Zeeshan. All rights reserved.
                </footer>
            </div>
        </div>
    );
}

function App() {
    return (
        <ToastProvider>
            <Router>
                <AppLayout />
            </Router>
        </ToastProvider>
    );
}

export default App;
