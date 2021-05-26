const express = require('express')
const { body } = require('express-validator')

const router = express.Router()

const itemController = require('../controllers/itemController')

router.post('/new', [body('title').isLength({max: 48, min: 8}).withMessage('Input length mismatch!')], itemController.createItem)

router.get('/all', itemController.getAllItems)

router.get('/id', itemController.getItemsById)

router.put('/update', itemController.updateItemById)

router.post('/unlist', itemController.removeItem)

module.exports = router;