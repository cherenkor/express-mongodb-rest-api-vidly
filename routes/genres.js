const auth = require('../middleware/auth');
const router = require('express').Router();
const { Genre, validateGenre } = require('../models/genre');

router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find().sort('name')
        res.send(genres);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

router.post('/', auth, async (req, res) => {
    const genreData = req.body;
    const { error } = validateGenre(genreData);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const genre = new Genre(genreData);
        await genre.save();
        res.send(genre);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const genre = await Genre.findById(id);

        if (!genre) return res.status(404).send(`Didn't find genre with id ${id}`);

        res.send(genre);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }


})

router.put('/:id', auth, async (req, res) => {
    try {
        const genreData = req.body;
        const { error } = validateGenre(genreData);
        if (error) return res.status(400).send(error.details[0].message);

        const id = req.params.id;
        const genre = await Genre.findByIdAndUpdate(id, genreData, { new: true });

        if (!genre) return res.status(404).send(`Didn't find genre with id ${id}`);

        res.send(genre)
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const genre = await Genre.findByIdAndRemove(id);

        if (!genre) return res.status(404).send(`Didn't found genre with id ${id}`);

        res.send(genre);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

module.exports = router;
