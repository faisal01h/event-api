const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Metric = new Schema({
    itemId: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    engagementPoints: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Metric', Metric)