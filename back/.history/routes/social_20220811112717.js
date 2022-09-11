const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config');

const socialController = require('../controllers/socialControl')


router.get('/', auth, socialController.getAllPost);
router.post('/', auth, multer, socialController.createPost);
router.put('/:id', auth, multer, socialController.modifyPost);
router.get('/:id', auth, socialController.getOnePost);
router.delete('/:id',auth, socialController.deletePost);
router.post('/:id/like', auth, socialController.likePost);

module.exports = router; 