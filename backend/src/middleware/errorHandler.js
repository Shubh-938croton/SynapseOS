/**
 * Global Error Handler Middleware
 * Catches unhandled errors across Express routes and formats standard JSON error response.
 */
const errorHandler = (err, req, res, next) => {
    console.error("❌ Unhandled Error:", err.stack || err.message || err);

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};

module.exports = errorHandler;
