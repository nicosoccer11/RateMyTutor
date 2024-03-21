const db = require('../config/db');

// Add a comment to a post
const addComment = async (req, res) => {
    const { postId, username, content } = req.body;
    const time = new Date();
  
    try {
      const newComment = await db.query(
        'INSERT INTO comments (PostID, UserID, Content, Time) VALUES ($1, $2, $3, $4) RETURNING *',
        [postId, username, content, time]
      );
      res.json(newComment.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error, check console for logs');
    }
  };

  // Delete a comment
const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    // Optional: Add additional checks to verify the user's permission to delete the comment
  
    try {
      await db.query('DELETE FROM comments WHERE CommentID = $1', [commentId]);
      res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error, check console for logs');
    }
};

// Get all comments for a post
const getCommentsForPost = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const comments = await db.query(
        'SELECT comments.*, users.Username FROM comments JOIN users ON comments.UserID = users.Username WHERE PostID = $1 ORDER BY Time ASC',
        [postId]
      );
      res.json(comments.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error, check console for logs');
    }
};

  module.exports = {
    addComment,
    deleteComment,
    getCommentsForPost
  };
  