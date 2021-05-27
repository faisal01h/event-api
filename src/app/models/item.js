const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Item = new Schema({
    title: {
        type: String,
        required: true
    },
    tingkatan: {
        type: String,
        required: true
    },
    daerah: {
        type: String,
        required: true
    },
    description: {
        type: Object,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    visibility: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Item', Item)