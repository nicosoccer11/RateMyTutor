// routes/postsRoutes.js
const express = require('express');
const { createPost } = require('../controllers/postsController');
const router = express.Router();

router.post('/posts', createPost);

module.exports = router;
