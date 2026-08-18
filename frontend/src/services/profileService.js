const API_URL = "http://localhost:5000/api/users";


// =======================================
// GET USER PROFILE
// =======================================

export const getUserProfile = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/profile`, {
        method: "GET",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch profile"
        );
    }

    return data;
};

// =======================================
// UPDATE USER PROFILE
// =======================================

export const updateUserProfile = async (profileData) => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to update profile"
        );
    }

    return data;
};

// =======================================
// CHANGE PASSWORD
// =======================================

export const changePassword = async (passwordData) => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/change-password`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(passwordData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to change password"
        );
    }

    return data;
};