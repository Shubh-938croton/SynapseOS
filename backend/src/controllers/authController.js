const bcrypt = require("bcrypt");
const authModel = require("../models/authModel");

const registerUser = async (req, res) => {

    try {

        const { full_name, username, email, password } = req.body;

        // Hash the password
        const password_hash = await bcrypt.hash(password, 10);

        const user = {
            full_name,
            username,
            email,
            password_hash
        };

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