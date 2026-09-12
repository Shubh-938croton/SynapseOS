const db = require("../config/database");

// =======================================
// Get User Settings
// =======================================
const getSettings = (userId, callback) => {

    const query = `
        SELECT
            setting_id,
            user_id,
            theme,
            notification_enabled,
            daily_goal_minutes,
            pomodoro_duration,
            short_break_duration,
            long_break_duration,
            created_at,
            updated_at
        FROM settings
        WHERE user_id = ?
    `;

    db.query(query, [userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};


// =======================================
// Create Default Settings
// =======================================
const createSettings = (userId, callback) => {

    const query = `
        INSERT INTO settings (
            user_id
        )
        VALUES (?)
    `;

    db.query(query, [userId], (err, result) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, result);

    });

};


// =======================================
// Update User Settings
// =======================================
const updateSettings = (userId, settings, callback) => {

    const fields = [];
    const values = [];

    if (settings.theme !== undefined) {
        fields.push("theme = ?");
        values.push(settings.theme);
    }

    if (settings.notification_enabled !== undefined) {
        fields.push("notification_enabled = ?");
        values.push(settings.notification_enabled);
    }

    if (settings.daily_goal_minutes !== undefined) {
        fields.push("daily_goal_minutes = ?");
        values.push(settings.daily_goal_minutes);
    }

    if (settings.pomodoro_duration !== undefined) {
        fields.push("pomodoro_duration = ?");
        values.push(settings.pomodoro_duration);
    }

    if (settings.short_break_duration !== undefined) {
        fields.push("short_break_duration = ?");
        values.push(settings.short_break_duration);
    }

    if (settings.long_break_duration !== undefined) {
        fields.push("long_break_duration = ?");
        values.push(settings.long_break_duration);
    }

    if (fields.length === 0) {
        return callback(new Error("No fields provided for update"), null);
    }

    const query = `
        UPDATE settings
        SET ${fields.join(", ")}
        WHERE user_id = ?
    `;
    values.push(userId);

    db.query(query, values, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });

};


// =======================================
// Delete User Settings
// =======================================
const deleteSettings = (userId, callback) => {

    const query = `
        DELETE FROM settings
        WHERE user_id = ?
    `;

    db.query(query, [userId], (err, result) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, result);

    });

};


// =======================================
// Export Functions
// =======================================
module.exports = {
    getSettings,
    createSettings,
    updateSettings,
    deleteSettings
};