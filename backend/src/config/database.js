require("dotenv").config();

const fs = require("fs");
const mysql = require("mysql2");

const sslCa = process.env.DB_SSL_CA
    ? process.env.DB_SSL_CA
    : fs.readFileSync(process.env.DB_SSL_CA_PATH, "utf8");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "synapseos",

    ssl: {
    ca: sslCa,
    rejectUnauthorized: true
},
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