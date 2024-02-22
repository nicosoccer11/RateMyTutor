// controllers/postsController.js
const db = require('../config/db');

const createPost = async (req, res) => {
  const { content, picture } = req.body; // Removed userId from the body, as it's obtained from the token now
  const time = new Date();
  const userId = req.username; // Use the username from the token

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
