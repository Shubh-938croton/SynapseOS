const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");


// =======================================
// Get Logged-In User Profile
// =======================================

const getUserProfile = (req, res) => {

    try {

        const userId = req.user.user_id;

        userModel.getUserProfile(
            userId,
            (err, results) => {

                if (err) {
                    console.error("Get user profile database error:", err);
                    return res.status(500).json({
                        message: "Failed to fetch user profile"
                    });

                }

                if (results.length === 0) {

                    return res.status(404).json({
                        message: "User not found"
                    });

                }

                return res.status(200).json({

                    message:
                        "Profile fetched successfully",

                    profile: results[0]

                });

            }
        );

    } catch (error) {

        console.error("Get user profile unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =======================================
// Update Profile
// =======================================

const updateProfile = (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            full_name,
            username,
            email,
            profile_picture,
            bio
        } = req.body;


        // =======================================
        // Validation
        // =======================================

        if (
            !full_name ||
            !username ||
            !email
        ) {

            return res.status(400).json({

                message:
                    "Full name, username and email are required"

            });

        }


        // =======================================
        // Check Duplicate Email / Username
        // =======================================

        userModel.findUserByEmailOrUsernameForUpdate(

            userId,
            email,
            username,

            (err, users) => {

                if (err) {
                    console.error("Update profile check duplicate error:", err);
                    return res.status(500).json({
                        message: "Failed to update profile"
                    });

                }


                if (users.length > 0) {

                    const existingUser = users[0];


                    if (
                        existingUser.email === email
                    ) {

                        return res.status(409).json({

                            message:
                                "Email already exists"

                        });

                    }


                    if (
                        existingUser.username === username
                    ) {

                        return res.status(409).json({

                            message:
                                "Username already exists"

                        });

                    }

                }


                // =======================================
                // Prepare Profile Data
                // =======================================

                const userData = {

                    full_name:
                        full_name.trim(),

                    username:
                        username.trim(),

                    email:
                        email.trim(),

                    profile_picture:
                        profile_picture || null,

                    bio:
                        bio || null

                };


                // =======================================
                // Update Database
                // =======================================

                userModel.updateProfile(

                    userId,
                    userData,

                    (err, result) => {

                        if (err) {
                            console.error("Update profile database error:", err);
                            return res.status(500).json({
                                message: "Failed to update profile"
                            });

                        }


                        if (
                            result.affectedRows === 0
                        ) {

                            return res.status(404).json({

                                message:
                                    "User not found"

                            });

                        }


                        return res.status(200).json({

                            message:
                                "Profile updated successfully"

                        });

                    }

                );

            }

        );

    } catch (error) {

        console.error("Update profile unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =======================================
// Change Password
// =======================================

const changePassword = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            current_password,
            new_password
        } = req.body;


        // =======================================
        // Validate Input
        // =======================================

        if (!new_password) {
            return res.status(400).json({
                message: "New password is required"
            });
        }

        if (new_password.length < 8) {
            return res.status(400).json({
                message: "New password must be at least 8 characters"
            });
        }

        // =======================================
        // Find User
        // =======================================

        userModel.findUserById(
            userId,
            async (err, users) => {
                if (err) {
                    console.error("Change password find user error:", err);
                    return res.status(500).json({
                        message: "Failed to change password"
                    });
                }

                if (users.length === 0) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }

                const user = users[0];

                // If user registered with Google and has placeholder hash,
                // allow them to set a password without current_password
                const isGoogleAccount = user.password_hash === "GOOGLE_OAUTH_ACCOUNT";

                if (!isGoogleAccount) {
                    if (!current_password) {
                        return res.status(400).json({
                            message: "Current password is required"
                        });
                    }

                    // =======================================
                    // Verify Current Password
                    // =======================================

                    const isMatch = await bcrypt.compare(
                        current_password,
                        user.password_hash
                    );

                    if (!isMatch) {
                        return res.status(401).json({
                            message: "Current password is incorrect"
                        });
                    }
                }


                // =======================================
                // Hash New Password
                // =======================================

                const passwordHash =
                    await bcrypt.hash(
                        new_password,
                        10
                    );


                // =======================================
                // Update Password
                // =======================================

                userModel.updatePassword(

                    userId,
                    passwordHash,

                    (err, result) => {

                        if (err) {
                            console.error("Change password database error:", err);
                            return res.status(500).json({
                                message: "Failed to update password"
                            });

                        }


                        return res.status(200).json({

                            message:
                                "Password changed successfully"

                        });

                    }

                );

            }

        );

    } catch (error) {

        console.error("Change password unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =======================================
// EXPORT
// =======================================

module.exports = {

    getUserProfile,
    updateProfile,
    changePassword

};