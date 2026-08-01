const userModel = require("../models/userModel");

// Get logged-in user's profile
const getUserProfile = (req, res) => {

    try {

        // Get authenticated user's ID from JWT
        const userId = req.user.user_id;

        userModel.getUserProfile(userId, (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            return res.status(200).json({
                message: "Profile fetched successfully",
                profile: results[0]
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// update profile
const updateProfile = (req, res) => {

    try {

        // Authenticated user's ID from JWT
        const userId = req.user.user_id;

        const {
            full_name,
            username,
            email
        } = req.body;

        // Check if email or username already exists
        userModel.findUserByEmailOrUsernameForUpdate(
            userId,
            email,
            username,
            (err, users) => {

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

                const userData = {
                    full_name,
                    username,
                    email
                };

                userModel.updateProfile(userId, userData, (err, result) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Failed to update profile",
                            error: err.message
                        });
                    }

                    return res.status(200).json({
                        message: "Profile updated successfully"
                    });

                });

            }
        );

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

module.exports = {
    getUserProfile,
    updateProfile
};