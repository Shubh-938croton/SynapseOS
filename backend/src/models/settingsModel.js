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

    const query = `
        UPDATE settings
        SET
            theme = ?,
            notification_enabled = ?,
            daily_goal_minutes = ?,
            pomodoro_duration = ?,
            short_break_duration = ?,
            long_break_duration = ?
        WHERE user_id = ?
    `;

    db.query(
        query,
        [
            settings.theme,
            settings.notification_enabled,
            settings.daily_goal_minutes,
            settings.pomodoro_duration,
            settings.short_break_duration,
            settings.long_break_duration,
            userId
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

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