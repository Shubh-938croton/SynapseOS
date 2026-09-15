/**
 * Global Error Handler Middleware
 * Catches unhandled errors across Express routes and formats standard JSON error response.
 */
const errorHandler = (err, req, res, next) => {
    console.error("❌ Unhandled Error:", err.stack || err.message || err);

    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({
            success: false,
            message: "Not allowed by CORS"
        });
    }

    const statusCode = err.statusCode || err.status || 500;
    const message = statusCode >= 500
        ? "Internal Server Error"
        : (err.message || "An error occurred");

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};

module.exports = errorHandler;
