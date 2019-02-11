const config = require("config");

module.exports = function() {
  if (!config.get("jsonPrivateKey")) {
    throw new Error("FATAL ERROR: jsonPrivateKey does not set up");
  }
};
