const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/analytics`;

// =======================================
// GET ANALYTICS
// =======================================

export const getAnalytics = async (period = "7d") => {
    const token = localStorage.getItem("token");

    const url = `${API_URL}?period=${encodeURIComponent(period)}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch analytics");
    }

    return data;
};

export const getProductivityAnalytics = async (period = "7d") => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/productivity?period=${encodeURIComponent(period)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch productivity analytics");
    return data;
};

export const getFocusAnalytics = async (period = "7d") => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/focus?period=${encodeURIComponent(period)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch focus analytics");
    return data;
};

export const getDailyTimeSeries = async (period = "7d") => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/daily?period=${encodeURIComponent(period)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch daily analytics");
    return data;
};