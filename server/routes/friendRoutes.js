const express = require('express');
const { addFriend, getFriends,deleteFriend } = require('../controllers/friendsController');
const router = express.Router();

// Route to add a new friend
router.post('/friends/add', addFriend);

// Route to add a new friend
router.post('/friends/get', getFriends);

// Route to remove a friend
router.post('/friends/delete', deleteFriend);

module.exports = router;
