const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PasswordReset = new Schema({
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    tokenHash: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('PasswordReset', PasswordReset);