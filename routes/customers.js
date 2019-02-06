const router = require('express').Router();
const { Customer, validateCustomer } = require('../models/customer');

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort('name');
        res.send(customers);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await Customer.findById(id);
        if (!customer) return res.status(404).send(`Can not found a customer with id ${id}`);

        res.send(customer);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

router.post('/', async (req, res) => {
    const customerData = req.body;
    const { error } = validateCustomer(customerData);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const customer = new Customer(customerData);
        await customer.save();
        res.send(customer);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

router.put('/:id', async (req, res) => {
    try {
        const customerData = req.body;
        const { error } = validateCustomer(customerData);
        if (error) return res.status(400).send(error.details[0].message);

        const id = req.params.id;
        const customer = await Customer.findByIdAndUpdate(id, customerData, { new: true });
        if (!customer) return res.status(404).send(`Can not found a customer with id ${id}`);

        res.send(customer);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await Customer.findByIdAndRemove(id);

        if (!customer) return res.status(404).send(`Can not found a customer with id ${id}`);

        res.send(customer);
    } catch (e) {
        console.error(e)
        res.status(500).send('Something went wrong. Check your request.')
    }
})

module.exports = router;