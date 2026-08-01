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

// to chech the login credential 
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        authModel.findUserByEmail(email, async (err, users) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            // User not found
            if (users.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const user = users[0];

            // Compare entered password with hashed password
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid password"
                });
            }

            // Login successful
            return res.status(200).json({
                message: "Login successful",
                user: {
                    user_id: user.user_id,
                    full_name: user.full_name,
                    username: user.username,
                    email: user.email
                }
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
    registerUser,
    loginUser
};