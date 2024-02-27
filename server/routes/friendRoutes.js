const express = require('express');
const { addFriend, getFriends } = require('../controllers/friendsController');
const router = express.Router();

// Route to add a new friend
router.post('/friends/add', addFriend);

// Route to get all friends
router.get('/friends/get', getFriends);

module.exports = router;
