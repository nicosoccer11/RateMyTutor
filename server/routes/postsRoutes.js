// routes/postsRoutes.js
const express = require('express');
const { createPost } = require('../controllers/postsController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/posts', authenticateToken, createPost);

module.exports = router;
