const express = require('express');
const { addFriend, acceptFriendRequest, declineFriendRequest, getFriendRequests, getFriends,deleteFriend } = require('../controllers/friendsController');
const router = express.Router();

// Route to add a new friend
router.post('/friends/add', addFriend);

// Route to accept a friend request
router.post('/friends/accept', acceptFriendRequest);

// Route to decline a friend request
router.post('/friends/decline', declineFriendRequest);

// Route to get the list of incoming friend requests
router.post('/friends/requests', getFriendRequests);

// Route to get all accepted friends
router.post('/friends/get', getFriends);

// Route to remove a friend
router.post('/friends/delete', deleteFriend);

module.exports = router;
