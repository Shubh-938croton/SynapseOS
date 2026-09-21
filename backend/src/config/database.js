const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const fs = require("fs");
const mysql = require("mysql2");

let sslCa = process.env.DB_SSL_CA;
if (!sslCa && process.env.DB_SSL_CA_PATH && fs.existsSync(process.env.DB_SSL_CA_PATH)) {
    try {
        sslCa = fs.readFileSync(process.env.DB_SSL_CA_PATH, "utf8");
    } catch {
        sslCa = undefined;
    }
}

const poolConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "synapseos",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

if (sslCa) {
    poolConfig.ssl = {
        ca: sslCa,
        rejectUnauthorized: true
    };
}

const pool = mysql.createPool(poolConfig);

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