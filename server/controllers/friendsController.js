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

const deleteFriend = async (req, res) => {
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
    // they are friends
    if (existingFriendship.rows.length > 0) {
     
      // remove friendship 
      const deleteFriendship = await db.query(
        'DELETE FROM friends WHERE (User1ID = $1 AND User2ID = $2) OR (User1ID = $2 AND User2ID = $1)',
        [user1Username, user2Username]
      );
    }
    else{
      return res.status(400).send('They are not a friend.');
    }


    res.json({
      message: 'Friendship ended with ${user2Username}',

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

// Function to get all the friends for user
const getFriends = async (req, res) => {
  const { username } = req.body; // Assuming you're getting the username in the request body
  try {
    // Getting all the friends where the user is user1id
    const friends1 = await db.query(`SELECT user2id AS friend FROM friends WHERE user1id = $1`, [username]);
    // Corrected: Now getting all the friends where the user is user2id
    const friends2 = await db.query(`SELECT user1id AS friend FROM friends WHERE user2id = $1`, [username]);

    // Combine both friend lists and remove duplicates
    const friends = [...friends1.rows.map(row => row.friend), ...friends2.rows.map(row => row.friend)];
    const uniqueFriends = Array.from(new Set(friends));

    res.json({
      message: 'Friends retrieved successfully',
      friends: uniqueFriends
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
  addFriend,
  getFriends,
  deleteFriend,
};
