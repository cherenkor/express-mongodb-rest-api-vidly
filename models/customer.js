const Joi = require('Joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: String,
        minlength: 10,
        maxlength: 15
    },
    isGold: {
        type: Boolean,
        default: false
    }
});
const Customer = mongoose.model('Customer', customerSchema);

const validateCustomer = customer => {
    const schema = {
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(3).required(),
        isGold: Joi.bool().required()
    };
    return Joi.validate(customer, schema);
};

module.exports = {
    Customer,
    validateCustomer
};