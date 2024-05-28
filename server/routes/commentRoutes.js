const express = require('express');
const { addComment, deleteComment, getCommentsForPost, getCommentCountForPost } = require('../controllers/commentsController');
const router = express.Router();

// Route to add a new comment
router.post('/comments', addComment);

// Route to delete a comment
router.delete('/comments/:commentId', deleteComment);

// Route to get all comments for a post
router.get('/comments/:postId', getCommentsForPost);

// Route to get all comments for a post
router.get('/comments/count/:postId', getCommentCountForPost);

// Add other routes here

module.exports = router;
