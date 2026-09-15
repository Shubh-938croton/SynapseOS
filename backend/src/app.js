const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { authLimiter, youtubeLimiter } = require("./middleware/rateLimiter");

const app = express();

// Disable Express fingerprinting
app.disable("x-powered-by");

// Apply Helmet security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

// Hardened CORS Configuration
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

// Health check endpoints (unrestricted by rate limits)
app.get(["/health", "/api/health"], (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const noteRoutes = require("./routes/noteRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const goalRoutes = require("./routes/goalRoutes");
const studySessionRoutes = require("./routes/studySessionRoutes");
const pomodoroRoutes = require("./routes/pomodoroRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const contestRoutes = require("./routes/contestRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());

// Routes with targeted rate limiters
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/youtube", youtubeLimiter, youtubeRoutes);

// General resource routes
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/study-sessions", studySessionRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;