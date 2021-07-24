const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Item = new Schema({
    title: {
        type: String,
        required: true
    },
    imageURI: {
        type: String,
        required: false
    },
    tingkatan: {
        type: String,
        required: true
    },
    daerah: {
        type: String,
        required: true
    },
    jenis: {
        type: String,
        required: true
    },
    pelaksanaan: {
        type: String,
        required: false
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
    },
    view: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Item', Item)