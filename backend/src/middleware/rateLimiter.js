const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for sensitive authentication endpoints:
 * - /api/auth/login
 * - /api/auth/register
 * - /api/auth/google
 *
 * Limit: 15 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // limit each IP to 15 requests per windowMs
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: "Too many authentication requests from this IP, please try again after 15 minutes."
    },
    handler: (req, res, next, options) => {
        res.status(429).json(options.message);
    }
});

/**
 * Rate limiter for external YouTube API proxy endpoints:
 * - /api/youtube/search
 * - /api/youtube/video/:id
 *
 * Limit: 60 requests per 15 minutes per IP
 */
const youtubeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60, // limit each IP to 60 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many YouTube requests, please try again later."
    },
    handler: (req, res, next, options) => {
        res.status(429).json(options.message);
    }
});

module.exports = {
    authLimiter,
    youtubeLimiter
};
