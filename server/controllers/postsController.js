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

// Function to get all posts from all friends
const getFriendsPosts = async (req, res) => {
  const { username } = req.body; // Assuming you're getting the username in the request body

  try {
    // Query to find all friends (both directions)
    const friends1 = await db.query(
      `SELECT user2id AS friend FROM friends WHERE user1id = $1 UNION SELECT user1id FROM friends WHERE user2id = $1`,
      [username]
    );

    // Extract friend usernames to an array
    const friendUsernames = friends1.rows.map(row => row.friend);

    // If there are no friends, return an empty array early
    if (friendUsernames.length === 0) {
      return res.json({
        message: 'No posts found because the user has no friends or no posts by friends.',
        posts: []
      });
    }

    // Query to get posts made by any of the friends
    const posts = await db.query(
      `SELECT * FROM posts WHERE UserID = ANY($1::varchar[]) ORDER BY Time DESC`,
      [friendUsernames]
    );

    res.json({
      message: 'Posts retrieved successfully',
      posts: posts.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error, check console for logs');
  }
};

module.exports = {
  createPost,
  getFriendsPosts,
};
