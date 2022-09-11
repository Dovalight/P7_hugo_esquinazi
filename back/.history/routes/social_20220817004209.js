const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer');

const socialController = require('../controllers/socialControl')
const commentController = require('../controllers/commentControl')


router.get('/', auth, socialController.getAllPost);
router.post('/', auth, multer, socialController.createPost);
router.put('/:id', auth, multer, socialController.modifyPost);
router.get('/:id', auth, socialController.getOnePost);
router.delete('/:id', auth, socialController.deletePost);
router.post('/:id/like', auth, socialController.likePost);
/* routes de recherche de post par mots clés +
routes Comment */
router.get('/:id/', auth, commentController.getAllComment);
router.post('/:id/', auth, commentController.createComment);
router.put('/:id/', auth, commentController.modifyComment);
router.delete('/:id/', auth, commentController.deleteComment);

module.exports = router; 