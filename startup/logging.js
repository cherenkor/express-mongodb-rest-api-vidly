require("express-async-errors");
const winston = require("winston");
const transportsOptions = { prettyPrint: true, colorize: true };

module.exports = function() {
  winston.add(
    new winston.transports.Console(transportsOptions),
    new winston.transports.File({
      filename: "logs/logfile.log",
      level: "error",
      ...transportsOptions
    })
  );

  winston.exceptions.handle(
    new winston.transports.Console(transportsOptions),
    new winston.transports.File({
      filename: "logs/uncaughtExceptions.log",
      ...transportsOptions
    })
  );

  process.on("unhandledRejection", ex => {
    winston.error(ex.message, ex);
    process.exit(1);
  });
};
