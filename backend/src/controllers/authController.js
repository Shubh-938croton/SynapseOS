const bcrypt = require("bcrypt");
const authModel = require("../models/authModel");

const registerUser = async (req, res) => {

    try {

        const { full_name, username, email, password } = req.body;

        // Check if email or username already exists
        authModel.findUserByEmailOrUsername(email, username, async (err, users) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (users.length > 0) {

                const existingUser = users[0];

                if (existingUser.email === email) {
                    return res.status(409).json({
                        message: "Email already exists"
                    });
                }

                if (existingUser.username === username) {
                    return res.status(409).json({
                        message: "Username already exists"
                    });
                }
            }

            // Hash password
            const password_hash = await bcrypt.hash(password, 10);

            const user = {
                full_name,
                username,
                email,
                password_hash
            };

            // Register user
            authModel.registerUser(user, (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: "Registration failed",
                        error: err.message
                    });
                }

                return res.status(201).json({
                    message: "User registered successfully",
                    userId: result.insertId
                });

            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

module.exports = {
    registerUser
};