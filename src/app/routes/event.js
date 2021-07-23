const express = require('express')
const passport = require('passport')
const clr = require('../lib/Color')

const router = express.Router()

const eventController = require('../controllers/eventController')

router.post('/register', passport.authenticate('jwt', {session:false}), eventController.registerToEvent)

router.get('/register/check', passport.authenticate('jwt', {session:false}), eventController.eventRegistrationCheck)

router.post('/fav', passport.authenticate('jwt', {session:false}), eventController.eventLike)

router.get('/fav', passport.authenticate('jwt', {session:false}), eventController.getLikedEvents)

module.exports = router