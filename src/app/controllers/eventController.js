const { validationResult, query } = require('express-validator')
const Item = require('../models/item')
const Metric = require('../models/metric')
const Telemetry = require('../models/telemetry')
const passport = require('passport')
const User = require('../models/user')
require('dotenv').config();

const env_metrics = process.env.METRICS || 'OFF';
const env_telemetry = process.env.TELEMETRY || 'OFF';

const clr = require('../lib/Color')
const EventRegistration = require('../models/eventRegistration')

exports.eventLike = (req, res, next) => {
    const eventId = req.body.itemId;
    passport.authenticate('jwt', {session:false}, (err, user)=> {
        const userId = user.id;

        Item.findById(eventId)
        .then(i_result => {
            User.findByIdAndUpdate(userId, { $push: {savedEvents: [eventId] } })
            .then(result => {
                console.log(result);
                
                
                res.status(200).json({
                    message: "Data liked",
                    result,
                    query
                })
            })
            .catch(err => {
                console.log(err);
                res.status(404).json({})
            })
        })
        .catch(i_err => {
            res.status(404).json({})
            clr.fail("Like item: Item not found", "post");
        })
    }) (req, res, next)
}

exports.registerToEvent = (req, res, next) => {
    const eventId = req.body.itemId;
    const isActive = req.body.isActive;
    const isPublic = req.body.isPublic;
    passport.authenticate('jwt', {session:false}, (err, user)=> {
        if(user) {
            const RegEvent = new EventRegistration({
                userId: user.id,
                itemId: eventId,
                active: isActive,
                isPublic: isPublic
            })

            RegEvent.save()
            .then(result => {
                res.status(200).json({
                    itemId: eventId,
                    active: isActive,
                    isPublic: isPublic
                })
            })
        }

    }) (req, res, next)
}

exports.eventRegistrationCheck = (req, res, next) => {
    passport.authenticate('jwt', {session:false}, (err, user)=> {
        EventRegistration.findOne({ userId: user.id })
        .then(result => {
            res.status(200).json({
                userId: result.userId,
                itemId: result.itemId
            })
        })
    }) (req, res, next)
}