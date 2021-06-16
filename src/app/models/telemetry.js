const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Telemetry = new Schema({
    itemId: {
        type: String,
        required: false
    },
    userId: {
        type:String,
        required: false
    },
    accessIp: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Telemetry', Telemetry)