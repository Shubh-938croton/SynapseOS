const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/notifications`;


// =======================================
// GET ALL NOTIFICATIONS
// =======================================

export const getNotifications = async () => {

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
            data.message || "Failed to fetch notifications"
        );
    }

    return data;
};


// =======================================
// GET UNREAD COUNT
// =======================================

export const getUnreadCount = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/unread-count`,
        {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch unread notification count"
        );
    }

    return data;
};


// =======================================
// MARK ONE NOTIFICATION AS READ
// =======================================

export const markNotificationAsRead = async (
    notificationId
) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/${notificationId}/read`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to mark notification as read"
        );
    }

    return data;
};


// =======================================
// MARK ALL NOTIFICATIONS AS READ
// =======================================

export const markAllNotificationsAsRead = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/read-all`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to mark all notifications as read"
        );
    }

    return data;
};


// =======================================
// DELETE NOTIFICATION
// =======================================

export const deleteNotification = async (
    notificationId
) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/${notificationId}`,
        {
            method: "DELETE",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to delete notification"
        );
    }

    return data;
};