const router = require('express').Router();

router.get('/', (req, res) => res.send('Welcome to the vidly.com api'));

module.exports = router;