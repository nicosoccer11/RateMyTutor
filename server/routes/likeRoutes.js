const express = require('express');
const { addLike, removeLike, getLikesForPost, checkUserLike } = require('../controllers/likesController');
const router = express.Router();

// Route to add a like to a post
router.post('/likes', addLike);

// Route to remove a like from a post
router.delete('/likes', removeLike);

// Route to get all likes for a post
router.get('/likes/:postId', getLikesForPost);

// Route to check if a user has liked a post
router.get('/likes/:postId/:username', checkUserLike);

// Add other routes here

module.exports = router;
