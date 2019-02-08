const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = require("express").Router();
const { Genre, validateGenre } = require("../models/genre");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const genreData = req.body;
  const { error } = validateGenre(genreData);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre(genreData);
  await genre.save();
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const genre = await Genre.findById(id);
  if (!genre) return res.status(404).send(`Didn't find genre with id ${id}`);

  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  const genreData = req.body;
  const { error } = validateGenre(genreData);
  if (error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;
  const genre = await Genre.findByIdAndUpdate(id, genreData, { new: true });
  if (!genre) return res.status(404).send(`Didn't find genre with id ${id}`);

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const id = req.params.id;
  const genre = await Genre.findByIdAndRemove(id);
  if (!genre) return res.status(404).send(`Didn't found genre with id ${id}`);

  res.send(genre);
});

module.exports = router;
