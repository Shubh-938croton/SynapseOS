const express = require("express");
const app = express();


const taskRoutes = require("./routes/taskRoutes");
const authRoutes=require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const noteRoutes = require("./routes/noteRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const goalRoutes = require("./routes/goalRoutes");
const studySessionRoutes = require("./routes/studySessionRoutes");

app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/study-sessions", studySessionRoutes);

module.exports = app;