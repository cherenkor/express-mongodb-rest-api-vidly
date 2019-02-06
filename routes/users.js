const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const { pick } = require('lodash');
const router = require('express').Router();
const { User, validateUser } = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (e) {
        console.error(e);
        res.status(500).send('Something went wrong. Check your request.');
    }
})

router.post('/', async (req, res) => {
    const userData = req.body;
    const { error } = validateUser(userData);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findOne({ email: userData.email });
        if (user) return res.status(400).send(`User with email ${userData.email} has already been registered.`);

        user = new User(userData);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = jwt.sign({ _id: user._id }, config.get('jsonPrivateKey'));
        res
            .header('x-auth-token', token)
            .send(pick(user, ['_id', 'name', 'email']));
    } catch (e) {
        console.error(e);
        res.status(500).send('Something went wrong. Check your request.');
    }
})

module.exports = router;