const db = require('../config/db');

// Add likes to a post
const addLike = async (req, res) => {
    const { postId, username } = req.body;
  
    try {
      const newLike = await db.query(
        'INSERT INTO likes (PostID, UserID) VALUES ($1, $2) RETURNING *',
        [postId, username]
      );
      res.json(newLike.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error, check console for logs');
    }
  };

  const removeLike = async (req, res) => {
    const { postId, username } = req.body;
  
    try {
      const deleteOp = await db.query(
        'DELETE FROM likes WHERE PostID = $1 AND UserID = $2 RETURNING *',
        [postId, username]
      );
  
      if (deleteOp.rowCount > 0) {
        res.json({ message: 'Like removed successfully' });
      } else {
        res.status(404).send('Like not found.');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error, check console for logs');
    }
  };
  
  const getLikesForPost = async (req, res) => {
    const { postId } = req.params;
    try {
      const likes = await db.query(
        'SELECT UserID FROM likes WHERE PostID = $1',
        [postId]
      );
  
      res.json({
        postId: postId,
        likes: likes.rows,
        count: likes.rowCount
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error, check console for logs');
    }
  };

  module.exports = {
    addLike,
    removeLike,
    getLikesForPost
  }
