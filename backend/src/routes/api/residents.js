const express = require("express");
const app = express();
const pool = require("../../utils/pool-connection");

const GET_ALL_RESIDENTS = `
    SELECT * FROM Resident 
`;

app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    connection.query(GET_ALL_RESIDENTS, (err, results) => {
      connection.release();

      if (err) {
        return res.send(err);
      }

      return res.json(results);
    });
  });
});

module.exports = app;
