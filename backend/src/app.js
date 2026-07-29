const express = require("express");

const app = express();

app.get("/", function (req, res) {
    res.json({
        project: "SynapseOS",
        version: "1.0",
        status: "Backend Running"
    });
});

module.exports = app;