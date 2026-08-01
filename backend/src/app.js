const express = require("express");
const app = express();

const taskRoutes = require("./routes/taskRoutes");
const authRoutes=require("./routes/authRoutes");

app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/auth",authRoutes);

module.exports = app;