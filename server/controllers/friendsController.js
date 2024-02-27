const db = require('../config/db');

const addFriend = async (req, res) => {
  const { user1Username, user2Username } = req.body;

  // Validate that user1Username and user2Username are different
  if (user1Username === user2Username) {
    return res.status(400).send('Users cannot be friends with themselves.');
  }

  try {
    // Check if users already are friends to avoid duplicates
    const existingFriendship = await db.query(
      'SELECT * FROM friends WHERE (User1ID = $1 AND User2ID = $2) OR (User1ID = $2 AND User2ID = $1)',
      [user1Username, user2Username]
    );

    if (existingFriendship.rows.length > 0) {
      return res.status(400).send('These users are already friends.');
    }

    // Insert friendship into the friends table
    const newFriendship = await db.query(
      'INSERT INTO friends (User1ID, User2ID) VALUES ($1, $2) RETURNING *',
      [user1Username, user2Username]
    );

    res.json({
      message: 'Friendship added successfully',
      friendship: newFriendship.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    if (err.code === "23503") { // PostgreSQL foreign key violation error code
      res.status(400).send('One or both users do not exist.');
    } else {
      res.status(500).send('Server Error');
    }
  }
};

module.exports = {
  addFriend
};
