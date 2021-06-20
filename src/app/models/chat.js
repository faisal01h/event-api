const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Chat = new Schema({
    userId1: {
        type: String,
        required: true
    },
    userId2: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isVisible: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Chat', Chat);