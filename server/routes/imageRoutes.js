// routes/imageRoutes.js
const express = require('express');
const {  UserUploadPicture, getUserProfilePicture,createUserProfilePicture, } = require('../controllers/imageController');
const router = express.Router();

router.get('/api/posts', getUserProfilePicture);

// Route to post user's profile picture
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
router.post('/api/posts', upload.single('image'), createUserProfilePicture);

module.exports = router;
