// controllers/postsController.js
const db = require('../config/db');

// Create a post
const createPost = async (req, res) => {
  const { content, picture, username } = req.body; 
  const time = new Date();
  const userId = username; 

  try {
    const newPost = await db.query(
      'INSERT INTO posts (UserID, Picture, Content, Time) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, picture, content, time]
    );
    res.json(newPost.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error, check console for logs');
  }
};

module.exports = {
  createPost,
};
