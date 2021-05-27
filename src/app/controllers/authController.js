const { validationResult, query } = require('express-validator')
const User = require('../models/user')

const clr = require('../lib/Color')

exports.getAllUsers = (req, res, next) => {
    var total;
    User.countDocuments().then(result => {total = result}).catch(err => {clr.fail(err)})
    User.find()
    .then(result => {
        res.status(200).json({
            status: 200,
            count: total,
            data: result
        })
        clr.success(new Date()+": Served getAllUsers", 'get')
    })
    .catch(err => {
        clr.fail(new Date()+": Cannot serve getAllUsers", 'get')
        clr.fail(err)
    })
}