import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import API from "../utils/axios";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await API.get("/tasks");
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

    const create = async (e) => {
        e?.preventDefault();
        if (!form.title.trim()) {
            toast.error("Please enter a task title");
            return;
        }
        try {
            setSubmitting(true);
            await API.post("/tasks", form);
            toast.success("Task created successfully!");
            setForm({ title: "", description: "" });
            fetchTasks();
        } catch (err) {
            // Error toast is handled by axios interceptor
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-gray-800 mb-2">My Tasks</h2>
                        <p className="text-gray-600">Create and manage your tasks</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Task</h3>
                        <form onSubmit={create}>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                                placeholder="Task Title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                            <textarea
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none mt-4 resize-none"
                                placeholder="Description (optional)"
                                rows="4"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                            <button
                                className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={create}
                                disabled={submitting}
                            >
                                {submitting ? "Adding..." : "Add Task"}
                            </button>
                        </form>
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
                                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks yet</h3>
                                    <p className="text-gray-500">Create your first task to get started!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tasks.map(t => (
                                        <div key={t._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 transform hover:-translate-y-1">
                                            <h3 className="font-bold text-xl text-gray-800 mb-3">{t.title}</h3>
                                            <p className="text-gray-600 min-h-[60px]">{t.description || "No description"}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    );
}
