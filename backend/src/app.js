const express = require("express");
const app = express();

const taskRoutes = require("./routes/taskRoutes");

app.use(express.json());

app.use("/api/tasks", taskRoutes);

module.exports = app;