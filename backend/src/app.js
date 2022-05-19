const createError = require("http-errors");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const bodyParser = require("body-parser");

const cookieSession = require("cookie-session");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleware");

const app = express();

app.use(helmet());
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: /localhost:\d{4}/, credentials: true }));
}

// Session support
const sessionConfig = {
  secure: false,
  keys: [process.env.SESS_SECRET],
};
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  sessionConfig.secure = true;
}

// app.use(session({

// }))

app.use(cookieParser());

app.use(logger("dev"));

app.use(bodyParser.json({ limit: "2.1mb" }));
app.use(bodyParser.urlencoded({ limit: "2.1mb", extended: false }));

// Routes
app.use("/routes", require("./routes"));

app.get("/", (req, res) => res.json("API working!"));
app.get("/favicon.ico", (req, res) => res.status(204));

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

module.exports = app;
