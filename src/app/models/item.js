const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Item = new Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tingkatan: {
        type: Object,
        required: true
    },
    daerah: {
        type: Object,
        required: true
    },
    description: {
        type: Object,
        required: true
    },
    authorId: {
        type: Number,
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