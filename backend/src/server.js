const app = require("./app");
const { startScheduler, stopScheduler } = require("./config/scheduler");
const pool = require("./config/database");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 SynapseOS Backend listening on port ${PORT} [NODE_ENV=${process.env.NODE_ENV || "development"}]`);
    startScheduler();
});

// ==========================================
// GRACEFUL SHUTDOWN (Render / Production)
// ==========================================
const shutdown = (signal) => {
    console.log(`\n⏳ Received ${signal}. Starting graceful shutdown...`);

    // 1. Stop background automation cron jobs
    stopScheduler();

    // 2. Stop accepting new HTTP connections
    server.close(() => {
        console.log("🔒 HTTP server closed.");

        // 3. Close database connection pool
        pool.end((err) => {
            if (err) {
                console.error("❌ Error closing database pool:", err.message);
            } else {
                console.log("🔒 Database connection pool closed.");
            }
            console.log("👋 SynapseOS shutdown complete.");
            process.exit(0);
        });
    });

    // Force exit after 10s if shutdown hangs
    setTimeout(() => {
        console.error("⚠️ Forced shutdown timeout exceeded.");
        process.exit(1);
    }, 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

module.exports = server;