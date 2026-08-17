const db = require("../config/database");


// =======================================
// GET ALL NOTIFICATIONS
// =======================================

const getNotifications = (userId, callback) => {

    const sql = `
        SELECT
            notification_id,
            type,
            title,
            message,
            reference_type,
            reference_id,
            is_read,
            created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(
        sql,
        [userId],
        callback
    );
};


// =======================================
// GET UNREAD NOTIFICATIONS
// =======================================

const getUnreadNotifications = (userId, callback) => {

    const sql = `
        SELECT
            notification_id,
            type,
            title,
            message,
            reference_type,
            reference_id,
            is_read,
            created_at
        FROM notifications
        WHERE user_id = ?
          AND is_read = FALSE
        ORDER BY created_at DESC
    `;

    db.query(
        sql,
        [userId],
        callback
    );
};


// =======================================
// GET UNREAD COUNT
// =======================================

const getUnreadCount = (userId, callback) => {

    const sql = `
        SELECT COUNT(*) AS unread_count
        FROM notifications
        WHERE user_id = ?
          AND is_read = FALSE
    `;

    db.query(
        sql,
        [userId],
        callback
    );
};


// =======================================
// MARK ONE NOTIFICATION AS READ
// =======================================

const markAsRead = (
    notificationId,
    userId,
    callback
) => {

    const sql = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE notification_id = ?
          AND user_id = ?
    `;

    db.query(
        sql,
        [
            notificationId,
            userId
        ],
        callback
    );
};


// =======================================
// MARK ALL NOTIFICATIONS AS READ
// =======================================

const markAllAsRead = (
    userId,
    callback
) => {

    const sql = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = ?
          AND is_read = FALSE
    `;

    db.query(
        sql,
        [userId],
        callback
    );
};


// =======================================
// DELETE NOTIFICATION
// =======================================

const deleteNotification = (
    notificationId,
    userId,
    callback
) => {

    const sql = `
        DELETE FROM notifications
        WHERE notification_id = ?
          AND user_id = ?
    `;

    db.query(
        sql,
        [
            notificationId,
            userId
        ],
        callback
    );
};


// =======================================
// CREATE NOTIFICATION
// =======================================

const createNotification = (
    userId,
    type,
    title,
    message,
    referenceType,
    referenceId,
    callback
) => {

    const sql = `
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            reference_type,
            reference_id
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            userId,
            type,
            title,
            message,
            referenceType || null,
            referenceId || null
        ],
        callback
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