const express = require('express')
const router = express.Router()

const authenticationController = require('../controllers/authController')

router.get('/all', authenticationController.getAllUsers)

router.get('/find', authenticationController.getUserInfo)

router.post('/register', authenticationController.register)

module.exports = router