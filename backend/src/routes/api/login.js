const express = require("express");
const pool = require("../../utils/pool-connection");
const sha = require("sha256");

const app = express();

let session = {};

app.get("/me", (req, res) => {
  // const { session } = req;

  // console.log(session);
  if (session.user) {
    res.json(session.user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

app.post("/login", (req, res) => {
  const GET_USER_BY_EMAIL = `SELECT * FROM Resident WHERE Email = ?`;

  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.status(500).send(err);
    }

    const { email, password } = req.body;

    const hash = sha(password);

    connection.query(GET_USER_BY_EMAIL, [email], (err, results) => {
      connection.release();

      if (err) {
        return res.status(500).send(err);
      }

      if (results.length === 0) {
        return res.status(401).send({
          error: "Invalid Credentials",
        });
      }

      if (results[0].Password !== hash) {
        return res.status(401).send({
          error: "Invalid Credentials",
        });
      }

      // console.log(results);

      session.user = JSON.parse(JSON.stringify(results[0]));

      // req.session.save();

      console.log(req.session);

      return res.status(200).json(results);
    });
  });
});

app.post("/create", (req, res) => {
  const CREATE_USER = `
        INSERT INTO Resident (Email, Password, ApartmentId, FirstName, LastName, OauthId)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

  pool.getConnection((err, connection) => {
    if (err) {
      if (connection) {
        connection.release();
      }

      return res.status(500).send(err);
    }

    const { email, password, apartmentId, firstName, lastName } = req.body;

    console.log(req.body);

    if (!email || !password || !apartmentId || !firstName || !lastName) {
      return res.status(400).send({
        error: "Email and Password are required",
      });
    }

    const hash = sha(password);

    connection.query(
      CREATE_USER,
      [email, hash, apartmentId, firstName, lastName, -1],
      (err, results) => {
        connection.release();

        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }

        console.log(results);
        const user = {
          ResidentId: results.insertId,
          ApartmentId: apartmentId,
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          OauthId: -1,
          ProfilePicture: null,
          SchoolGrade: "F",
        };
        session.user = JSON.parse(JSON.stringify(user));
        // session.save();

        return res.status(200).json(results);
      }
    );
  });
});

app.get("/logout", (req, res) => {
  session = {};
  res.sendStatus(204);
});

module.exports = app;
