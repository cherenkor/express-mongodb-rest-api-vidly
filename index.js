require("express-async-errors");
const error = require("./middleware/error.js");
const winston = require("winston");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("Joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
// Routes
const home = require("./routes/home");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

if (!config.get("jsonPrivateKey")) {
  console.error("FATAL ERROR: jsonPrivateKey does not set up");
  process.exit(1);
}

winston.add(new winston.transports.File({ filename: "logfile.log" }));

mongoose
  .connect("mongodb://localhost:27017/vidly", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to the MongoDB..."))
  .catch(() => console.error("Could not connect to the MongoDB..."));

app.use(express.json());

// Routes
app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
