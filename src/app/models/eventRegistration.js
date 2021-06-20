const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventRegistration = new Schema({
    userId: {
        type: String,
        required: true
    },
    itemId: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    isPublic: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('EventRegistration', EventRegistration);