const express = require('express')
const passport = require('passport')

const router = express.Router()

const authenticationController = require('../controllers/authController')

router.get('/user/all', authenticationController.getAllUsers)

router.get('/user/find', passport.authenticate('jwt', { }), authenticationController.getUserInfo)

router.post('/register', authenticationController.register)

router.post('/login', authenticationController.login)

module.exports = router