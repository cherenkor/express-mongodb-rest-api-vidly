const router = require('express').Router();
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort('name');
        res.send(movies);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findById(id);

        if (!movie) return res.status(400).send(`Can not find movie with id ${id}`);

        res.send(movie);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    try {
        const genreId = req.body.genreId;
        const genre = await Genre.findById(genreId);

        if (!genre) return res.status(400).send(`Can not find genre with id ${genreId}`);

        const { title, numberInStock, dailyRentalRate } = req.body;
        const movie = new Movie({
            title,
            genre: {
                _id: genreId,
                name: genre.name
            },
            numberInStock,
            dailyRentalRate
        });
        await movie.save();
        res.send(movie);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

router.put('/:id', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    try {
        const genreId = req.body.genreId;
        const genre = await Genre.findById(genreId);

        if (!genre) return res.status(400).send(`Can not find genre with id ${genreId}`);

        const movieId = req.params.id;
        const { title, numberInStock, dailyRentalRate } = req.body;
        const movieData = {
            title,
            genre: {
                _id: genreId,
                name: genre.name
            },
            numberInStock,
            dailyRentalRate
        };
        let movie = await Movie.findByIdAndUpdate(
            movieId,
            movieData,
            { new: true }
        );
        res.send(movie);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findByIdAndRemove(id);

        if (!movie) return res.status(400).send(`Can not find movie with id ${id}`);

        res.send(movie);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

module.exports = router;