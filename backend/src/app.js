const express = require("express");

const app = express();

const taskRoutes = require("./routes/taskRoutes");

app.get("/", (req, res) => {
    res.send("Welcome to SynapseOS Backend 🚀");
});

app.use("/api/tasks", taskRoutes);

module.exports = app;