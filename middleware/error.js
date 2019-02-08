const winston = require("winston");

module.exports = function(error, res, res, next) {
  winston.error(error.message, error);
  res
    .status(500)
    .send("Somethind went wrong. Check your request and repeat again.");
};
