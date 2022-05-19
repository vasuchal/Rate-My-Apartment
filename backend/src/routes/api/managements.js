const express = require("express");
const app = express();
const pool = require("../../utils/pool-connection");

const GET_ALL_MANAGEMENTS = `
    SELECT * FROM Management;
`;

const GET_AVERAGE_MANAGEMENT_SCORE = `
    SELECT AVG(OverallAvgScore) AS MgmtAvgScore
    FROM Review NATURAL JOIN Apartment NATURAL JOIN Management
    WHERE ManagementName = ?
    GROUP BY ManagementName
    ;
`;

const FILTER_MANAGEMENT = `
      SELECT Management.Name, AVG(OverallAvgScore) AS MgmtAvg
      FROM Management JOIN Apartment ON Management.Name = Apartment.ManagementName NATURAL JOIN Review
      GROUP BY Management.Name
      HAVING MgmtAvg > ?
`;

app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    connection.query(GET_ALL_MANAGEMENTS, (err, results) => {
      connection.release();

      if (err) {
        return res.send(err);
      }

      return res.json(results);
    });
  });
});

app.get("/score/:name", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    connection.query(
      GET_AVERAGE_MANAGEMENT_SCORE,
      [req.params.name],
      (err, results) => {
        connection.release();

        if (err) {
          return res.send(err);
        }

        return res.json(results);
      }
    );
  });
});

// Filters managements above a certain score
app.get("/management/:score", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    // Gets all managements with a rating higher than the input
    connection.query(FILTER_MANAGEMENT, [req.params.score], (err, results) => {
      connection.release();

      if (err) {
        return res.send(err);
      }

      return res.json({ data: results });
    });
  });
});

// join review with apartment with management

module.exports = app;
