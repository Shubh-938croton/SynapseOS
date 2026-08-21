const API_URL = "http://localhost:5000/api/settings";

// =======================================
// GET SETTINGS
// =======================================

export const getSettings = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "GET",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch settings"
        );
    }

    return data;
};


// =======================================
// UPDATE SETTINGS
// =======================================

export const updateSettings = async (settings) => {

    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(settings)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to update settings"
        );
    }

    return data;
};