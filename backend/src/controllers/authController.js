const bcrypt = require("bcrypt");
const crypto = require("crypto");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const authModel = require("../models/authModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {

    try {

        const { full_name, username, email, password } = req.body;

        if (!full_name || !full_name.trim()) {
            return res.status(400).json({
                message: "Full name is required"
            });
        }

        if (!username || !username.trim()) {
            return res.status(400).json({
                message: "Username is required"
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            });
        }

        const trimmedFullName = full_name.trim();
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim().toLowerCase();

        // Check if email or username already exists
        authModel.findUserByEmailOrUsername(trimmedEmail, trimmedUsername, async (err, users) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (users && users.length > 0) {

                const existingUser = users[0];

                if (existingUser.email.toLowerCase() === trimmedEmail) {
                    return res.status(409).json({
                        message: "Email already exists"
                    });
                }

                if (existingUser.username.toLowerCase() === trimmedUsername) {
                    return res.status(409).json({
                        message: "Username already exists"
                    });
                }
            }

            // Hash password
            const password_hash = await bcrypt.hash(password, 10);

            const user = {
                full_name: trimmedFullName,
                username: trimmedUsername,
                email: trimmedEmail,
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

// login 
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        const trimmedEmail = email.trim().toLowerCase();

        authModel.findUserByEmail(trimmedEmail, async (err, users) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            // User not found
            if (!users || users.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const user = users[0];

            // If account was created with Google OAuth and has no local password
            if (user.password_hash === "GOOGLE_OAUTH_ACCOUNT") {
                return res.status(400).json({
                    message: "This account was created with Google Sign-In. Please sign in with Google or set a password in your Profile."
                });
            }

            // Compare entered password with hashed password
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid password"
                });
            }

            // Generate JWT
            const token = jwt.sign(
                {
                    user_id: user.user_id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
                }
            );

            // Login successful
            return res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    user_id: user.user_id,
                    full_name: user.full_name,
                    username: user.username,
                    email: user.email,
                    profile_picture: user.profile_picture || null
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

// Google OAuth Login / Register
const googleLogin = async (req, res) => {

    try {

        const { credential, id_token, access_token } = req.body;
        const tokenToVerify = credential || id_token;

        let email;
        let name;
        let picture;

        if (tokenToVerify) {

            // Verify Google ID token
            const googleClientId = process.env.GOOGLE_CLIENT_ID;
            const client = new OAuth2Client(googleClientId);

            try {
                const ticket = await client.verifyIdToken({
                    idToken: tokenToVerify,
                    audience: googleClientId
                });

                const payload = ticket.getPayload();
                email = payload.email;
                name = payload.name;
                picture = payload.picture;

            } catch (verifyError) {
                // Fallback check via tokeninfo endpoint if needed
                console.warn("verifyIdToken fallback:", verifyError.message);
                const tokenInfoRes = await axios.get(
                    `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenToVerify}`
                );

                email = tokenInfoRes.data.email;
                name = tokenInfoRes.data.name;
                picture = tokenInfoRes.data.picture;
            }

        } else if (access_token) {

            // Verify Google Access Token via UserInfo API
            const userInfoRes = await axios.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }
            );

            email = userInfoRes.data.email;
            name = userInfoRes.data.name;
            picture = userInfoRes.data.picture;

        } else {

            return res.status(400).json({
                message: "Google credential or access token is required"
            });

        }

        if (!email) {
            return res.status(400).json({
                message: "Unable to retrieve verified email from Google account"
            });
        }

        // Check if user already exists in database
        authModel.findUserByEmail(email, async (err, users) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (users && users.length > 0) {

                const existingUser = users[0];

                // Generate JWT for existing user
                const token = jwt.sign(
                    {
                        user_id: existingUser.user_id,
                        email: existingUser.email
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
                    }
                );

                return res.status(200).json({
                    message: "Google login successful",
                    token,
                    user: {
                        user_id: existingUser.user_id,
                        full_name: existingUser.full_name,
                        username: existingUser.username,
                        email: existingUser.email,
                        profile_picture: existingUser.profile_picture
                    }
                });

            }

            // User does not exist, create new Google user
            let baseUsername = (email.split("@")[0] || "user")
                .replace(/[^a-zA-Z0-9_]/g, "")
                .toLowerCase();

            if (!baseUsername || baseUsername.length < 3) {
                baseUsername = "user_" + Math.floor(1000 + Math.random() * 9000);
            }

            // Ensure username uniqueness
            authModel.findUserByUsername(baseUsername, async (uErr, existingUsernames) => {

                let finalUsername = baseUsername;

                if (existingUsernames && existingUsernames.length > 0) {
                    finalUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
                }

                // Create a random secure password hash to satisfy MySQL NOT NULL constraint
                const randomPassword = crypto.randomBytes(32).toString("hex");
                const password_hash = await bcrypt.hash(randomPassword, 10);

                const newUserData = {
                    full_name: name || finalUsername,
                    username: finalUsername,
                    email: email,
                    password_hash: password_hash,
                    profile_picture: picture || null
                };

                authModel.registerGoogleUser(newUserData, (regErr, result) => {

                    if (regErr) {
                        return res.status(500).json({
                            message: "Failed to create Google user account",
                            error: regErr.message
                        });
                    }

                    const newUserId = result.insertId;

                    // Generate JWT for new user
                    const token = jwt.sign(
                        {
                            user_id: newUserId,
                            email: email
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
                        }
                    );

                    return res.status(201).json({
                        message: "User registered and logged in with Google successfully",
                        token,
                        user: {
                            user_id: newUserId,
                            full_name: newUserData.full_name,
                            username: newUserData.username,
                            email: newUserData.email,
                            profile_picture: newUserData.profile_picture
                        }
                    });

                });

            });

        });

    } catch (error) {

        console.error("Google authentication error:", error);

        return res.status(500).json({
            message: "Google authentication failed",
            error: error.message
        });

    }

};

module.exports = {
    registerUser,
    loginUser,
    googleLogin
};