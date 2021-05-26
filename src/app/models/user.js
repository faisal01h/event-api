const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Item = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateofbirth: {
        type: Date,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false
    }

}, {
    timestamps: true
})