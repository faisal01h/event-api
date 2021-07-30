const express = require('express')
const passport = require('passport')
const { body } = require('express-validator')

const router = express.Router()

const itemController = require('../controllers/itemController')

router.post('/new', passport.authenticate('jwt', {session:false}), [body('title').isLength({max: 48, min: 8}).withMessage('Input length mismatch!')], itemController.createItem)

router.post('/new/image', passport.authenticate('jwt', {session:false}), itemController.addImageData);

router.get('/paginated', itemController.getSeveralItems)

router.get('/all', itemController.getAllItems)

router.get('/all/visible', itemController.getAllVisibleItems)

router.get('/all/filter', itemController.getFilteredItems)

router.post('/all/filter', itemController.getFilteredItems)

router.get('/view/:itemId', itemController.getItemsById)

router.put('/view/:itemId', [body('title').isLength({max: 48, min: 8}).withMessage('Input length mismatch!'), passport.authenticate('jwt', { session: false })], itemController.updateItemById)

router.patch('/view/:itemId/:target', [passport.authenticate('jwt', { session: false })], itemController.updateSpecificItemComponentById)

router.put('/unlist/:itemId', passport.authenticate('jwt', { session: false }), itemController.removeItem)

router.post('/view/:itemId/comment', passport.authenticate('jwt', { session: false }), itemController.submitComment)

router.post('/view/:itemId/comment/:commentId', passport.authenticate('jwt', { session: false }), itemController.submitCommentReply)

router.post('/view/:itemId/comment/:commentId/upvote', passport.authenticate('jwt', { session: false }), itemController.upvoteComment)

module.exports = router;