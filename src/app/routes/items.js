const express = require('express')
const passport = require('passport')
const { body } = require('express-validator')

const router = express.Router()

const itemController = require('../controllers/itemController')

router.post('/new', [body('title').isLength({max: 48, min: 8}).withMessage('Input length mismatch!')], itemController.createItem)

router.get('/paginated', itemController.getSeveralItems)

router.get('/all', itemController.getAllItems)

router.get('/all/visible', itemController.getAllVisibleItems)

router.get('/all/filter', itemController.getFilteredItems)

router.get('/view/:itemId', itemController.getItemsById)

router.put('/view/:itemId', [body('title').isLength({max: 48, min: 8}).withMessage('Input length mismatch!'), passport.authenticate('jwt', { session: false })], itemController.updateItemById)

router.put('/unlist/:itemId', passport.authenticate('jwt', { session: false }), itemController.removeItem)

module.exports = router;