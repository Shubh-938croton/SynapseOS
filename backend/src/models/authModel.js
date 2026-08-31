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


const findUserByEmail = (email, callback) => {

    const query = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    db.query(query, [email], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

const findUserByUsername = (username, callback) => {

    const query = `
        SELECT *
        FROM users
        WHERE username = ?
    `;

    db.query(query, [username], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

const registerGoogleUser = (user, callback) => {

    const query = `
        INSERT INTO users
        (
            full_name,
            username,
            email,
            password_hash,
            profile_picture
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            user.full_name,
            user.username,
            user.email,
            user.password_hash,
            user.profile_picture || null
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};

module.exports = {
    registerUser,
    registerGoogleUser,
    findUserByEmailOrUsername,
    findUserByEmail,
    findUserByUsername
};