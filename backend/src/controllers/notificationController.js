const notificationModel = require("../models/notificationModel");


// =======================================
// GET ALL NOTIFICATIONS
// =======================================

const getNotifications = (req, res) => {
    try {
        const userId = req.user.user_id;

        notificationModel.getNotifications(
            userId,
            (err, notifications) => {

                if (err) {

                    console.error(
                        "Get Notifications Error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to fetch notifications"
                    });

                }

                return res.status(200).json({
                    message: "Notifications fetched successfully",
                    notifications: notifications || []
                });

            }
        );
    } catch (error) {
        console.error("Get notifications unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// =======================================
// GET UNREAD NOTIFICATIONS
// =======================================

const getUnreadNotifications = (req, res) => {
    try {
        const userId = req.user.user_id;

        notificationModel.getUnreadNotifications(
            userId,
            (err, notifications) => {

                if (err) {

                    console.error(
                        "Get Unread Notifications Error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to fetch unread notifications"
                    });

                }

                return res.status(200).json({
                    message: "Unread notifications fetched successfully",
                    notifications: notifications || []
                });

            }
        );
    } catch (error) {
        console.error("Get unread notifications unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// =======================================
// GET UNREAD COUNT
// =======================================

const getUnreadCount = (req, res) => {
    try {
        const userId = req.user.user_id;

        notificationModel.getUnreadCount(
            userId,
            (err, result) => {

                if (err) {

                    console.error(
                        "Get Unread Count Error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to fetch unread count"
                    });

                }

                return res.status(200).json({
                    message: "Unread count fetched successfully",

                    unreadCount:
                        Number(result[0]?.unread_count) || 0
                });

            }
        );
    } catch (error) {
        console.error("Get unread count unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// =======================================
// MARK ONE AS READ
// =======================================

const markAsRead = (req, res) => {
    try {
        const userId = req.user.user_id;

        const notificationId =
            Number(req.params.id);

        if (!notificationId) {

            return res.status(400).json({
                message: "Invalid notification ID"
            });

        }

        notificationModel.markAsRead(
            notificationId,
            userId,
            (err, result) => {

                if (err) {

                    console.error(
                        "Mark Notification Read Error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to mark notification as read"
                    });

                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: "Notification not found"
                    });

                }

                return res.status(200).json({
                    message: "Notification marked as read"
                });

            }
        );
    } catch (error) {
        console.error("Mark as read unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// =======================================
// MARK ALL AS READ
// =======================================

const markAllAsRead = (req, res) => {
    try {
        const userId = req.user.user_id;

        notificationModel.markAllAsRead(
            userId,
            (err, result) => {

                if (err) {

                    console.error(
                        "Mark All Notifications Read Error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to mark notifications as read"
                    });

                }

                return res.status(200).json({
                    message: "All notifications marked as read",

                    updated:
                        result.affectedRows
                });

            }
        );
    } catch (error) {
        console.error("Mark all as read unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// =======================================
// DELETE NOTIFICATION
// =======================================

const deleteNotification = (req, res) => {
    try {
        const userId = req.user.user_id;

        const notificationId =
            Number(req.params.id);

        if (!notificationId) {

            return res.status(400).json({
                message: "Invalid notification ID"
            });

        }

        notificationModel.deleteNotification(
            notificationId,
            userId,
            (err, result) => {

                if (err) {

                    console.error(
                        "Delete Notification Error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to delete notification"
                    });

                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: "Notification not found"
                    });

                }

                return res.status(200).json({
                    message: "Notification deleted successfully"
                });

            }
        );
    } catch (error) {
        console.error("Delete notification unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// =======================================
// CREATE NOTIFICATION
// =======================================

const createNotification = (req, res) => {
    try {
        const userId = req.user.user_id;

        const {
            type,
            title,
            message,
            referenceType,
            referenceId
        } = req.body;


        if (
            !type ||
            !title ||
            !message
        ) {

            return res.status(400).json({
                message:
                    "type, title and message are required"
            });

        }


        notificationModel.createNotification(
            userId,
            type,
            title,
            message,
            referenceType,
            referenceId,
            (err, result) => {

                if (err) {

                    console.error(
                        "Create Notification Error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to create notification"
                    });

                }

                return res.status(201).json({

                    message:
                        "Notification created successfully",

                    notificationId:
                        result.insertId

                });

            }
        );
    } catch (error) {
        console.error("Create notification unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// =======================================
// EXPORT
// =======================================

module.exports = {

    getNotifications,

    getUnreadNotifications,

    getUnreadCount,

    markAsRead,

    markAllAsRead,

    deleteNotification,

    createNotification

};