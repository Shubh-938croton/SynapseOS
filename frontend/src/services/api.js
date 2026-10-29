import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach JWT token automatically to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: handle 401 token expiration gracefully
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const isAuthEndpoint = error.config && error.config.url && error.config.url.includes("/auth/");
            if (!isAuthEndpoint) {
                // Clear expired/invalid session token
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        return Promise.reject(error);
    }
);

export default api;