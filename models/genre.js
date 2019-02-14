const mongoose = require("mongoose");
const Joi = require("Joi");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50
  }
});
const Genre = mongoose.model("Genre", genreSchema);

const validateGenre = genre => {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
  };
  return Joi.validate(genre, schema);
};

module.exports = {
  genreSchema,
  Genre,
  validateGenre
};
