const notificationModel = require("../models/notificationModel");


// =======================================
// GET ALL NOTIFICATIONS
// =======================================

const getNotifications = (req, res) => {

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
                    message: "Failed to fetch notifications",
                    error: err.message
                });

            }

            return res.status(200).json({
                message: "Notifications fetched successfully",
                notifications
            });

        }
    );
};


// =======================================
// GET UNREAD NOTIFICATIONS
// =======================================

const getUnreadNotifications = (req, res) => {

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
                    message: "Failed to fetch unread notifications",
                    error: err.message
                });

            }

            return res.status(200).json({
                message: "Unread notifications fetched successfully",
                notifications
            });

        }
    );
};


// =======================================
// GET UNREAD COUNT
// =======================================

const getUnreadCount = (req, res) => {

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
                    message: "Failed to fetch unread count",
                    error: err.message
                });

            }

            return res.status(200).json({
                message: "Unread count fetched successfully",

                unreadCount:
                    Number(result[0]?.unread_count) || 0
            });

        }
    );
};


// =======================================
// MARK ONE AS READ
// =======================================

const markAsRead = (req, res) => {

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
                    message: "Failed to mark notification as read",
                    error: err.message
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
};


// =======================================
// MARK ALL AS READ
// =======================================

const markAllAsRead = (req, res) => {

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
                    message: "Failed to mark notifications as read",
                    error: err.message
                });

            }

            return res.status(200).json({
                message: "All notifications marked as read",

                updated:
                    result.affectedRows
            });

        }
    );
};


// =======================================
// DELETE NOTIFICATION
// =======================================

const deleteNotification = (req, res) => {

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
                    message: "Failed to delete notification",
                    error: err.message
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
};


// =======================================
// CREATE NOTIFICATION
// =======================================

const createNotification = (req, res) => {

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
                    message: "Failed to create notification",
                    error: err.message
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