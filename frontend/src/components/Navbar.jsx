import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const role = localStorage.getItem("role");
    const isAdmin = role === "admin";

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="container mx-auto px-4 py-4 max-w-7xl">
                <div className="flex justify-between items-center">
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Task Manager
                        </h1>
                    </Link>
                    <div className="flex gap-4 items-center">
                        <Link 
                            to="/dashboard" 
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                location.pathname === "/dashboard" 
                                    ? "bg-indigo-100 text-indigo-700" 
                                    : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            Dashboard
                        </Link>
                        {isAdmin && (
                            <Link 
                                to="/admin" 
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    location.pathname === "/admin" 
                                        ? "bg-indigo-100 text-indigo-700" 
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                Admin Panel
                            </Link>
                        )}
                        <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                            <span className="text-sm text-gray-600">
                                {isAdmin ? (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                        Admin
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                        User
                                    </span>
                                )}
                            </span>
                            <button 
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
