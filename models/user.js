const Joi = require('Joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    }
});

const User = mongoose.model('User', userSchema);

const validateUser = user => {
    const schema = {
        name: Joi.string().alphanum().min(3).max(50).required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().min(6).max(255).required(),
    };
    return Joi.validate(user, schema)
};

module.exports = {
    User,
    validateUser
};