// routes/userRoutes.js
const express = require('express');
const router = express.Router();

//Update here when add new route
const { createUser, getAllUsers, getUserByUsername, loginUser } = require('../controllers/usersController');

// Route to create a new user
router.post('/users', createUser);

//Route to get all users    
router.get('/users', getAllUsers);

// Route to get a user by username   
router.get('/users/:username', getUserByUsername); 

// Route to login a user
router.post('/users/login', loginUser);

// Define other user routes here

module.exports = router;
