// routes/userRoutes.js
const express = require('express');
const router = express.Router();
//Update here when add new route
const {createUser, getAllUsers, getUserByUsername, getUserProfilePicture, createUserProfilePicture} = require('../controllers/usersController'); 
// Route to create a new user
router.post('/users', createUser);

//Route to get all users    
router.get('/users', getAllUsers);

// Route to get a user by username   
router.get('/users/:username', getUserByUsername); // Corrected this line

// Route to get user's profile picture
router.get('/api/posts', getUserProfilePicture);

// Route to post user's profile picture
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
router.post('/api/posts', upload.single('image'), createUserProfilePicture);
// Define other user routes here
module.exports = router;