const express = require('express')
const router = express.Router()

const authenticationController = require('../controllers/authController')

router.get('/all', authenticationController.getAllUsers)

module.exports = router