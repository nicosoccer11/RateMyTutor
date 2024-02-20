// routes/userRoutes.js
const express = require('express');
const router = express.Router();
//Update here when add new route
const { createUser, getAllUsers } = require('../controllers/usersController');
// Route to create a new user
router.post('/users', createUser);

//Route to get all users    
router.get('/users', getAllUsers);

// Define other user routes here

module.exports = router;
