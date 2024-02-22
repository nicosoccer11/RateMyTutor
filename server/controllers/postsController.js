// controllers/postsController.js
const db = require('../config/db');

const createPost = async (req, res) => {
  const { userId, content, picture } = req.body; // Assuming picture is base64 encoded or null
  const time = new Date(); // Automatically set the time to now

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
