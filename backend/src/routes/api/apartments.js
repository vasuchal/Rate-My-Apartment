const express = require("express");
const app = express();
const pool = require("../../utils/pool-connection");

const GET_ALL_APARTMENTS = `
    SELECT * FROM Apartment 
`;

const GET_ALL_APARTMENTS_IN_A_STATE = `
    SELECT * FROM Apartment WHERE State = ?
`;

const GET_APARTMENT_BY_ID = `
    SELECT * FROM Apartment WHERE ApartmentId = ?
`;

const GET_APARTMENT_BY_NAME = (name) => `
    SELECT * FROM Apartment WHERE ApartmentName LIKE '%${name}%' ORDER BY ApartmentName
`;

const COUNT_ROWS_QUERY_STR = (query) => `
    SELECT COUNT(*) FROM (${query}) AS count
`;

// SQL query to filter by different parts of apartment
const FILTER_QUERY = (query, filters) => {
  let filterQuery = "";
  if (filters.length > 0) {
    filterQuery = `WHERE ${filters.join(" AND ")}`;
  }

  return `${query} ${filterQuery}`;
};

const PAGINATE_QUERY = (query, limit, offset) => `
    ${query} LIMIT ${limit} ${offset ? `OFFSET ${offset * limit}` : ""}
`;

app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    let query = GET_ALL_APARTMENTS;

    // Build array of key=value pairs to filter by from req.query
    const filters = [];
    const reqKeys = Object.keys(req.query);

    reqKeys.forEach((key) => {
      if (key !== "limit" && key !== "offset") {
        filters.push(`${key} = '${req.query[key]}'`);
      }
    });

    const filteredQuery = COUNT_ROWS_QUERY_STR(FILTER_QUERY(query, filters));

    connection.query(filteredQuery, (err, results) => {
      if (err) {
        connection.release();
        return res.send(err);
      }

      const count = results[0]["COUNT(*)"];

      query = FILTER_QUERY(query, filters);

      if (req.query.limit) {
        query = PAGINATE_QUERY(query, req.query.limit, req.query.offset);
      }

      connection.query(query, (err, results) => {
        connection.release();

        if (err) {
          return res.send(err);
        }

        return res.send({
          count,
          results,
        });
      });
    });
  });
});

app.get("/state/:state", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    connection.query(
      GET_ALL_APARTMENTS_IN_A_STATE,
      [req.params.state],
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

// Write a route that will get apartment by name
app.get("/name/:name", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    connection.query(GET_APARTMENT_BY_NAME(req.params.name), (err, results) => {
      connection.release();

      if (err) {
        return res.send(err);
      }

      return res.json({ results });
    });
  });
});

app.get("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.send(err);
    }

    connection.query(GET_APARTMENT_BY_ID, [req.params.id], (err, results) => {
      connection.release();

      if (err) {
        return res.send(err);
      }

      return res.json(results);
    });
  });
});

module.exports = app;
