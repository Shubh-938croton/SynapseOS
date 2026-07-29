const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Shubh@DBMS2026",
    database: "synapseos"
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected");
    }
});

module.exports = connection;