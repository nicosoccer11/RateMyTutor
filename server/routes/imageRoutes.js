// routes/imageRoutes.js
const express = require('express');
const { getUserProfilePicture,createUserProfilePicture,deleteUserProfilePicture } = require('../controllers/imageController');
const router = express.Router();

// Route to get user's profile picture
router.get('/image/get', getUserProfilePicture);

// Route to delete user's profile picture
router.post('/image/delete', deleteUserProfilePicture);

// Route to post user's profile picture
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
router.post('/image/post', upload.single('image'), createUserProfilePicture);

module.exports = router;