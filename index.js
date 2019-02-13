const winston = require("winston");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

require("./startup/logging")();
require("./startup/validation")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();

const server = app.listen(PORT, () =>
  winston.info(`Server listening on port ${PORT}`)
);

module.exports = server;
