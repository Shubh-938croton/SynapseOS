const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


const taskRoutes = require("./routes/taskRoutes");
const authRoutes=require("./routes/authRoutes");
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
const errorHandler = require("./middleware/errorHandler");
const youtubeRoutes =
    require("./routes/youtubeRoutes");

app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/auth",authRoutes);
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

  app.use(
    "/api/youtube",
    youtubeRoutes
);

// Global Error Handler
app.use(errorHandler);


  

module.exports = app;