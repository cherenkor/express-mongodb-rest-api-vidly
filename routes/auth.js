const Joi = require('Joi');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const { User } = require('../models/user');

router.post('/', async (req, res) => {
    const userData = req.body;
    const { error } = validate(userData);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findOne({ email: userData.email });
        if (!user) return res.status(400).send(`Invalid email or password`);

        const validatePassword = await bcrypt.compare(userData.password, user.password);
        if (!validatePassword) return res.status(400).send(`Invalid email or password`);

        const token = user.generateAuthToken();
        res.send(token);
    } catch (e) {
        console.error(e);
        res.status(500).send('Something went wrong. Check your request.');
    }
})

const validate = req => {
    const schema = {
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().min(6).max(255).required(),
    };
    return Joi.validate(req, schema)
};

module.exports = router;