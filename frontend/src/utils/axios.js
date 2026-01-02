import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: "http://localhost:5052/api/v1",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for automatic error handling
API.interceptors.response.use(
  (response) => {
    // Don't show toast for successful responses automatically
    // Let individual components handle success messages
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    // Handle different error status codes
    const status = error.response?.status;
    const message = error.response?.data?.message || "An error occurred";

    if (status === 401) {
      toast.error("Unauthorized. Please login again.");
      localStorage.clear();
      window.location.href = "/login";
    } else if (status === 403) {
      toast.error("Access forbidden. You don't have permission.");
    } else if (status === 404) {
      toast.error("Resource not found.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      // For other errors, show the specific error message
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default API;
