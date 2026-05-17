import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogIn, LogOut, LayoutDashboard, ListChecks, PlusSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; 

const Sidebar = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user?.User?.Role;

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    const activeNavClass = "w-full justify-start gap-2 rounded-lg border border-slate-500 bg-slate-700 text-left text-white";
    const inactiveNavClass = "w-full justify-start gap-2 rounded-lg text-left text-slate-100 hover:bg-slate-800 hover:text-white";

    return (
        <aside className="w-full border-b bg-slate-900 text-slate-100 md:sticky md:top-0 md:h-screen md:w-72 md:border-b-0 md:border-r md:border-slate-800">
            <div className="p-5 md:p-6">
                <h2 className="text-lg font-semibold tracking-wide">Task Manager</h2>
            </div>

            <nav className="px-4 pb-5 md:px-5">
                <ul className="space-y-2">
                    <li>
                        <NavLink to="/">
                            {({ isActive }) => (
                                <Button variant="ghost" className={isActive ? activeNavClass : inactiveNavClass}>
                                    <Home size={18} /> Home
                                </Button>
                            )}
                        </NavLink>
                    </li>

                    {!isLoggedIn && (
                        <li>
                            <NavLink to="/auth">
                                {({ isActive }) => (
                                    <Button variant="ghost" className={isActive ? activeNavClass : inactiveNavClass}>
                                        <LogIn size={18} /> Sign In / Register
                                    </Button>
                                )}
                            </NavLink>
                        </li>
                    )}

                    {isLoggedIn && role === "USER" && (
                        <>
                            <li>
                                <NavLink to="/userHome">
                                    {({ isActive }) => (
                                        <Button variant="ghost" className={isActive ? activeNavClass : inactiveNavClass}>
                                            <ListChecks size={18} /> My Tasks
                                        </Button>
                                    )}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/createTask">
                                    {({ isActive }) => (
                                        <Button variant="ghost" className={isActive ? activeNavClass : inactiveNavClass}>
                                            <PlusSquare size={18} /> Create Task
                                        </Button>
                                    )}
                                </NavLink>
                            </li>
                        </>
                    )}

                    {isLoggedIn && role === "ADMIN" && (
                        <li>
                            <NavLink to="/dashboard">
                                {({ isActive }) => (
                                    <Button variant="ghost" className={isActive ? activeNavClass : inactiveNavClass}>
                                        <LayoutDashboard size={18} /> Dashboard
                                    </Button>
                                )}
                            </NavLink>
                        </li>
                    )}

                    {isLoggedIn && (
                        <li className="pt-2">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2 border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800 hover:text-white"
                                onClick={handleLogout}
                            >
                                <LogOut size={18} /> Logout
                            </Button>
                        </li>
                    )}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
