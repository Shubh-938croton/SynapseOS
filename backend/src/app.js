const express = require("express");
const app = express();

const taskRoutes = require("./routes/taskRoutes");
const authRoutes=require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);

module.exports = app;