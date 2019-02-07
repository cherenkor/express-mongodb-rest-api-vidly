const auth = require('../middleware/auth');
const router = require('express').Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const { Rental, validateRental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().sort('-dateOut');
        res.send(rentals);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

router.post('/', auth, async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const { customerId, movieId } = req.body;

        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).send(`Can not find customer with id ${id}`);

        let movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).send(`Can not find movie with id ${id}`);

        const rentalData = {
            customer: {
                _id: customerId,
                name: customer.name,
                phone: customer.phone,
                isGold: customer.isGold
            },
            movie: {
                _id: movieId,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        };

        let rental = new Rental(rentalData);
        new Fawn.Task()
            .save('rentals', rental)
            .update(
                'movies',
                { _id: movieId },
                {
                    $inc: {
                        numberInStock: -1
                    }
                }
            )
            .run()

        res.send(rental);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

module.exports = router;