require("dotenv").config();

const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "synapseos",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test initial connectivity
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err.message);
        return;
    }

    console.log("✅ Connected to MySQL Database Pool (synapseos)");
    connection.release();
});

module.exports = pool;