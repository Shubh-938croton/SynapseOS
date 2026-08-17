const express = require("express");

const router = express.Router();

const notificationController = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");


// =======================================
// NOTIFICATION ROUTES
// =======================================


// GET ALL NOTIFICATIONS
router.get(
    "/",
    authMiddleware,
    notificationController.getNotifications
);


// GET UNREAD NOTIFICATIONS
router.get(
    "/unread",
    authMiddleware,
    notificationController.getUnreadNotifications
);


// GET UNREAD COUNT
router.get(
    "/unread-count",
    authMiddleware,
    notificationController.getUnreadCount
);


// CREATE NOTIFICATION
router.post(
    "/",
    authMiddleware,
    notificationController.createNotification
);


// MARK ONE NOTIFICATION AS READ
router.patch(
    "/:id/read",
    authMiddleware,
    notificationController.markAsRead
);


// MARK ALL NOTIFICATIONS AS READ
router.patch(
    "/read-all",
    authMiddleware,
    notificationController.markAllAsRead
);


// DELETE NOTIFICATION
router.delete(
    "/:id",
    authMiddleware,
    notificationController.deleteNotification
);


module.exports = router;