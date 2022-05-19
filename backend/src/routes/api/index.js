const express = require("express");
const app = express();

// Put all routes here
app.use("/managements", require("./managements"));
app.use("/apartments", require("./apartments"));
app.use("/comments", require("./comments"));
app.use("/reviews", require("./reviews"));
app.use("/residents", require("./residents"));
app.use('/auth', require('./login'));

module.exports = app;
