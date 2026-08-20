const settingsModel = require("../models/settingsModel");

// =======================================
// Get User Settings
// =======================================
const getSettings = (req, res) => {

    try {

        const userId = req.user.user_id;

        settingsModel.getSettings(userId, (err, settings) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            // =======================================
            // Settings don't exist → create defaults
            // =======================================
            if (settings.length === 0) {

                settingsModel.createSettings(
                    userId,
                    (err, result) => {

                        if (err) {
                            return res.status(500).json({
                                message: "Failed to create default settings",
                                error: err.message
                            });
                        }

                        // Fetch newly created settings
                        settingsModel.getSettings(
                            userId,
                            (err, newSettings) => {

                                if (err) {
                                    return res.status(500).json({
                                        message: "Failed to fetch settings",
                                        error: err.message
                                    });
                                }

                                return res.status(200).json({
                                    message: "Settings fetched successfully",
                                    settings: newSettings[0]
                                });

                            }
                        );

                    }
                );

                return;
            }

            // =======================================
            // Settings already exist
            // =======================================
            return res.status(200).json({
                message: "Settings fetched successfully",
                settings: settings[0]
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};


// =======================================
// Update User Settings
// =======================================
const updateSettings = (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            theme,
            notification_enabled,
            daily_goal_minutes,
            pomodoro_duration,
            short_break_duration,
            long_break_duration
        } = req.body;

        // =======================================
        // Validate Theme
        // =======================================
        if (
            theme !== undefined &&
            theme !== "Light" &&
            theme !== "Dark"
        ) {

            return res.status(400).json({
                message: "Theme must be either Light or Dark"
            });

        }

        // =======================================
        // Validate Numeric Settings
        // =======================================
        if (
            daily_goal_minutes !== undefined &&
            daily_goal_minutes <= 0
        ) {

            return res.status(400).json({
                message: "Daily goal must be greater than 0"
            });

        }

        if (
            pomodoro_duration !== undefined &&
            pomodoro_duration <= 0
        ) {

            return res.status(400).json({
                message: "Pomodoro duration must be greater than 0"
            });

        }

        if (
            short_break_duration !== undefined &&
            short_break_duration < 0
        ) {

            return res.status(400).json({
                message: "Short break duration cannot be negative"
            });

        }

        if (
            long_break_duration !== undefined &&
            long_break_duration < 0
        ) {

            return res.status(400).json({
                message: "Long break duration cannot be negative"
            });

        }

        // =======================================
        // Prepare Settings
        // =======================================
        const settings = {
            theme,
            notification_enabled,
            daily_goal_minutes,
            pomodoro_duration,
            short_break_duration,
            long_break_duration
        };

        settingsModel.updateSettings(
            userId,
            settings,
            (err, result) => {

                if (err) {

                    return res.status(500).json({
                        message: "Failed to update settings",
                        error: err.message
                    });

                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: "Settings not found"
                    });

                }

                return res.status(200).json({
                    message: "Settings updated successfully"
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


// =======================================
// Delete User Settings
// =======================================
const deleteSettings = (req, res) => {

    try {

        const userId = req.user.user_id;

        settingsModel.deleteSettings(
            userId,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: "Database error",
                        error: err.message
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message: "Settings not found"
                    });
                }

                return res.status(200).json({
                    message: "Settings deleted successfully"
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
    getSettings,
    updateSettings,
    deleteSettings
};