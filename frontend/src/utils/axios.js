import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5052/api/v1",
});

// Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor for error handling + toasts
API.interceptors.response.use(
  (response) => {
    // Let individual components handle success messages
    return response;
  },
  (error) => {
    // Network / CORS / server unreachable
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message =
      error.response.data?.message || "Something went wrong";

    if (status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.clear();
      window.location.href = "/login";
    } else if (status === 403) {
      toast.error("Access denied. Admin permission required.");
    } else if (status === 404) {
      toast.error("Requested resource not found.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default API;
