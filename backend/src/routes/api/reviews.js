const express = require("express");
const app = express();
const pool = require("../../utils/pool-connection");

const GET_REVIEW_FOR_APT_ID = `
    SELECT * FROM Review WHERE ApartmentId = ?
`;

/**
 * Get review values
 */
const GET_REVIEW = `
      SELECT OverallAvgScore, NoiseAvgScore, LocationAvgScore, WifiAvgScore
      FROM Review
      WHERE ApartmentId = ?
`;

/**
 * Updates a review
 */
const UPDATE_REVIEW = `
      UPDATE Review SET OverallAvgScore = ?, NoiseAvgScore = ?, LocationAvgScore = ?, WifiAvgScore = ?
      WHERE ApartmentId = ?
`;

module.exports = {
  UPDATE_REVIEW,
  GET_REVIEW,
};

app.get("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    connection.query(GET_REVIEW_FOR_APT_ID, [req.params.id], (err, results) => {
      connection.release();

      if (err) {
        return res.send(err);
      }

      return res.json(results);
    });
  });
});

module.exports = app;
