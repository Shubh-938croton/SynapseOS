const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    console.log("Authorization Header:", authHeader);

    const token = authHeader.split(" ")[1];

    console.log("Extracted Token:", token);
    console.log("JWT_SECRET in middleware:", process.env.JWT_SECRET);

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded Token:", decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.log("JWT Error Name:", error.name);
        console.log("JWT Error Message:", error.message);

        return res.status(401).json({
            name: error.name,
            message: error.message
        });

    }

};

module.exports = verifyToken;