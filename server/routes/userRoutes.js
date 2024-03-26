// routes/userRoutes.js
const express = require('express');
const router = express.Router();

//Update here when add new route
const { createUser, getAllUsers, 
        loginUser, getUserProfile, updateUser, 
        searchUsersByUsername, searchEverything } = require('../controllers/usersController');

// Route to create a new user
router.post('/users', createUser);

//Route to get all users    
router.get('/users', getAllUsers);

// Route to update a user by username
router.patch('/users/update/:username', updateUser);

// Route to login a user
router.post('/users/login', loginUser);

// Route to get a user's profile who is logged in
router.get('/profile', getUserProfile);

// Route to search users by username
router.get('/users/search/username', searchUsersByUsername);

// Route to search everything
router.get('/users/search', searchEverything);

// Define other user routes here

module.exports = router;
