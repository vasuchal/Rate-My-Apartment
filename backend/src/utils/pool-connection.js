const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 100,
  multipleStatements: true,
  waitForConnections: true,
  queueLimit: 0,
  host: "34.132.176.117",
  user: "root",
  password: "test123",
  database: "rate_my_apartment",
});

module.exports = pool;
