const express = require('express');
const { addFriend } = require('../controllers/friendsController');
const router = express.Router();

// Route to add a new friend
router.post('/friends/add', addFriend);

module.exports = router;
