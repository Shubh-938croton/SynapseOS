const db = require("../config/database");

// =======================================
// Get User Profile
// =======================================

const getUserProfile = (userId, callback) => {

    const query = `
        SELECT
            user_id,
            full_name,
            username,
            email,
            profile_picture,
            bio,
            created_at,
            updated_at
        FROM users
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
// Check Email / Username Availability
// =======================================

const findUserByEmailOrUsernameForUpdate = (
    userId,
    email,
    username,
    callback
) => {

    const query = `
        SELECT
            user_id,
            email,
            username
        FROM users
        WHERE
            (email = ? OR username = ?)
            AND user_id != ?
    `;

    db.query(
        query,
        [email, username, userId],
        (err, results) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, results);

        }
    );

};


// =======================================
// Update Profile
// =======================================

const updateProfile = (
    userId,
    userData,
    callback
) => {

    const query = `
        UPDATE users
        SET
            full_name = ?,
            username = ?,
            email = ?,
            profile_picture = ?,
            bio = ?
        WHERE user_id = ?
    `;

    db.query(
        query,
        [
            userData.full_name,
            userData.username,
            userData.email,
            userData.profile_picture,
            userData.bio,
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
// Find User By ID
// Used For Password Change
// =======================================

const findUserById = (
    userId,
    callback
) => {

    const query = `
        SELECT
            user_id,
            password_hash
        FROM users
        WHERE user_id = ?
    `;

    db.query(
        query,
        [userId],
        (err, results) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, results);

        }
    );

};


// =======================================
// Update Password
// =======================================

const updatePassword = (
    userId,
    passwordHash,
    callback
) => {

    const query = `
        UPDATE users
        SET password_hash = ?
        WHERE user_id = ?
    `;

    db.query(
        query,
        [passwordHash, userId],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};


// =======================================
// EXPORT
// =======================================

module.exports = {

    getUserProfile,
    findUserByEmailOrUsernameForUpdate,
    updateProfile,
    findUserById,
    updatePassword

};