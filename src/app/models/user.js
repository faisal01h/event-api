const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    imageURI: {
        type: String,
        required: false
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
        required: true
    },
    visibility: {
        type: Boolean,
        required: true
    },
    myEvents: {
        type: Array,
        required: false
    },
    savedEvents: {
        type: Array,
        required:false
    },
    misc: {
        type: Object,
        required: false
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('User', User);