import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import API from "../utils/axios";

export default function AdminPanel() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAll = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await API.get("/tasks/all");
            setTasks(res.data.tasks || res.data);

            // Show toast if Redis cache was used
            if (res.data.cached === true) {
                toast.info("⚡ Data loaded from Redis cache", {
                    icon: "🔥",
                });
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to fetch tasks";
            setError(errorMsg);
            // Error toast is handled by axios interceptor
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await API.delete(`/tasks/${id}`);
            toast.success("Task deleted successfully!");
            fetchAll();
        } catch (err) {
            // Error toast is handled by axios interceptor
        }
    };

    useEffect(() => { fetchAll(); }, []);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-gray-800 mb-2">Admin Panel</h2>
                        <p className="text-gray-600">Manage all tasks across the platform</p>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                            <p className="font-medium">Error: {error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {tasks.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
                                    <p className="text-gray-500">There are no tasks in the system yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tasks.map(t => (
                                        <div key={t._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="font-bold text-xl text-gray-800 flex-1">{t.title}</h3>
                                                <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                                                    {t.user?.role || "user"}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-4 min-h-[60px]">{t.description || "No description"}</p>
                                            {t.user && (
                                                <div className="mb-4 pt-4 border-t border-gray-100">
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-medium">Created by:</span> {t.user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-medium">Email:</span> {t.user.email}
                                                    </p>
                                                </div>
                                            )}
                                            <button
                                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                                onClick={() => remove(t._id)}
                                            >
                                                Delete Task
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
