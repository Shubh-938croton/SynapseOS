const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const fs = require("fs");
const dns = require("dns");
const mysql = require("mysql2");

// Ensure Node prioritizes IPv4 to prevent getaddrinfo ENOTFOUND on cloud containers (e.g. Render)
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
}

let sslCa = process.env.DB_SSL_CA;
if (sslCa && typeof sslCa === "string") {
    // Unescape literal \n if passed as a single-line environment variable string
    sslCa = sslCa.replace(/\\n/g, "\n").trim();
} else if (!sslCa && process.env.DB_SSL_CA_PATH && fs.existsSync(process.env.DB_SSL_CA_PATH)) {
    try {
        sslCa = fs.readFileSync(process.env.DB_SSL_CA_PATH, "utf8");
    } catch {
        sslCa = undefined;
    }
}

// Clean and sanitize environment variable inputs (stripping whitespace, quotes, protocols)
let rawHost = (process.env.DB_HOST || "localhost").trim().replace(/^['"]|['"]$/g, "");
rawHost = rawHost.replace(/^[a-zA-Z]+:\/\//, ""); // strip mysql:// or https:// if pasted
rawHost = rawHost.split("/")[0].trim();

let host = rawHost;
let port = Number(String(process.env.DB_PORT || "3306").trim().replace(/^['"]|['"]$/g, "")) || 3306;

// Handle edge-case where user pasted host:port into DB_HOST
if (rawHost.includes(":") && !rawHost.startsWith("[")) {
    const parts = rawHost.split(":");
    host = parts[0].trim();
    if (!process.env.DB_PORT && parts[1]) {
        port = Number(parts[1].trim()) || port;
    }
}

const user = (process.env.DB_USER || "root").trim().replace(/^['"]|['"]$/g, "");
const database = (process.env.DB_NAME || "synapseos").trim().replace(/^['"]|['"]$/g, "");
const password = process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD).trim() : "";

const poolConfig = {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0,
    connectTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
};

// Automatic SSL support for cloud databases (Aiven, PlanetScale, AWS RDS, etc.)
const isCloudDb = host.includes("aivencloud.com") || host.includes("ondigitalocean.com") || host.includes("aws.com");
const requireSsl = Boolean(sslCa || process.env.DB_SSL === "true" || isCloudDb);

if (requireSsl) {
    poolConfig.ssl = {
        // If a CA cert is provided, enforce strict verification unless explicitly disabled
        rejectUnauthorized: Boolean(sslCa && process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false"),
        ...(sslCa ? { ca: sslCa } : {})
    };
}

const pool = mysql.createPool(poolConfig);

// Test initial connectivity
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err.message);
        return;
    }

    console.log(`✅ Connected to MySQL Database Pool (${database} on ${host}:${port})`);
    connection.release();
});

module.exports = pool;
