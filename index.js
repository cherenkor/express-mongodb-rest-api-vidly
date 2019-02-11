require("express-async-errors");
const winston = require("winston");
const config = require("config");
const Joi = require("Joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

require("./startup/routes")(app);
require("./startup/db")();

if (!config.get("jsonPrivateKey")) {
  console.error("FATAL ERROR: jsonPrivateKey does not set up");
  process.exit(1);
}

winston.add(
  new winston.transports.File({
    filename: "logs/logfile.log",
    handleExceptions: true
  })
);

process.on("unhandledRejection", ex => {
  winston.error(ex.message, ex);
  process.exit(1);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
