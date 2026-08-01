const db = require("../config/database");

const registerUser = (user, callback) => {

    const query = `
        INSERT INTO users
        (
            full_name,
            username,
            email,
            password_hash
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            user.full_name,
            user.username,
            user.email,
            user.password_hash
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};

const findUserByEmailOrUsername = (email, username, callback) => {

    const query = `
        SELECT *
        FROM users
        WHERE email = ? OR username = ?
    `;

    db.query(query, [email, username], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

module.exports = {
    registerUser,
    findUserByEmailOrUsername
};