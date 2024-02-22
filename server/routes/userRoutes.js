// routes/userRoutes.js
const express = require('express');
const router = express.Router();

//Update here when add new route
const { createUser, getAllUsers, getUserByUsername, loginUser, getUserProfile } = require('../controllers/usersController');

// Route to create a new user
router.post('/users', createUser);

//Route to get all users    
router.get('/users', getAllUsers);

// Route to get a user by username   
router.get('/users/:username', getUserByUsername); 

// Route to login a user
router.post('/users/login', loginUser);

// Route to get a user's profile who is logged in
router.get('/profile', getUserProfile);

// Define other user routes here

module.exports = router;
