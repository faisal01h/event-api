const express = require('express')
const passport = require('passport')
const clr = require('../lib/Color')

const router = express.Router()

const authenticationController = require('../controllers/authController')

router.get('/user/all', authenticationController.getAllUsers)

router.get('/user/find', passport.authenticate('jwt', {session:false}), authenticationController.getPublicUserInfo)

router.post('/user/find', passport.authenticate('jwt', {session:false}), authenticationController.getUserInfo)

router.post('/register', authenticationController.register)

router.post('/login', authenticationController.login)

router.post('/passwordreset', authenticationController.passwordReset)

router.post('/passwordreset/reset', authenticationController.processPasswordReset)

module.exports = router