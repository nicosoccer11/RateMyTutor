// routes/postsRoutes.js
const express = require('express');
const { createPost, getFriendsPosts } = require('../controllers/postsController');
const router = express.Router();

// Route to create a new post
router.post('/posts', createPost);

// Route to get posts from friends
router.get('/posts/friends/:username', getFriendsPosts);

module.exports = router;
