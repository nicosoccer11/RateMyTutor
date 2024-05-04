const db = require('../config/db');

// Function to send a friend request to another user
const addFriend = async (req, res) => {
  const { user1Username, user2Username } = req.body;

  if (user1Username === user2Username) {
    return res.status(400).send('Users cannot be friends with themselves.');
  }

  try {
    const existingRelationship = await db.query(
      'SELECT * FROM friends WHERE (User1ID = $1 AND User2ID = $2) OR (User1ID = $2 AND User2ID = $1)',
      [user1Username, user2Username]
    );

    if (existingRelationship.rows.length > 0) {
      return res.status(400).send('A friend request is already pending or you are already friends.');
    }

    await db.query(
      'INSERT INTO friends (User1ID, User2ID, status) VALUES ($1, $2, \'requested\') RETURNING *',
      [user1Username, user2Username]
    );

    res.json({ message: 'Friend request sent successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to accept a friend request
const acceptFriendRequest = async (req, res) => {
  const { user1Username, user2Username } = req.body; // Assuming user1Username sent the request and user2Username is accepting

  try {
    const result = await db.query(
      'UPDATE friends SET status = \'accepted\' WHERE User1ID = $1 AND User2ID = $2 AND status = \'requested\' RETURNING *',
      [user1Username, user2Username]
    );

    if (result.rows.length === 0) {
      return res.status(400).send('Friend request not found or already accepted.');
    }

    res.json({ message: 'Friend request accepted successfully', friendship: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to decline a friend request
const declineFriendRequest = async (req, res) => {
  const { user1Username, user2Username } = req.body; // Assuming user1Username sent the request and user2Username is declining

  try {
    const result = await db.query(
      'DELETE FROM friends WHERE ((User1ID = $1 AND User2ID = $2) OR (User1ID = $2 AND User2ID = $1)) AND status = \'requested\'',
      [user1Username, user2Username]
    );

    if (result.rowCount === 0) {
      return res.status(400).send('Friend request not found or already handled.');
    }

    res.json({ message: `Friend request from ${user1Username} to ${user2Username} declined successfully.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to get all the friend requests for a user, including requester's first and last name
const getFriendRequests = async (req, res) => {
  const { username } = req.body; // The username of the user checking their friend requests

  try {
    // Query to find where the user is the target of a friend request
    // Joining the 'users' table to get the first and last name of the requester
    const query = `
      SELECT u.username AS requester, u.firstname, u.lastname
      FROM friends f
      JOIN users u ON f.User1ID = u.username
      WHERE f.User2ID = $1 AND f.status = 'requested'
    `;
    const result = await db.query(query, [username]);

    if (result.rows.length === 0) {
      return res.json({ message: 'You have no friend requests at this time.' });
    }

    // Extracting the usernames and names of the requesters
    const friendRequests = result.rows.map(row => ({
      username: row.requester,
      firstName: row.firstname,
      lastName: row.lastname
    }));

    res.json({
      message: 'Friend requests retrieved successfully.',
      friendRequests: friendRequests
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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

// Function to get all the accepted friends for a user
const getFriends = async (req, res) => {
  const { username } = req.body; // Assuming you're getting the username in the request body
  try {
    // Getting all the friends where the user is user1id and the friendship has been accepted
    const friends1 = await db.query(
      `SELECT user2id AS friend FROM friends WHERE user1id = $1 AND status = 'accepted'`,
      [username]
    );
    // Getting all the friends where the user is user2id and the friendship has been accepted
    const friends2 = await db.query(
      `SELECT user1id AS friend FROM friends WHERE user2id = $1 AND status = 'accepted'`,
      [username]
    );

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

const checkFriendshipStatus = async (req, res) => {
  const { user1Username, user2Username } = req.params;

  try {
    const result = await db.query(
      'SELECT status FROM friends WHERE (User1ID = $1 AND User2ID = $2) OR (User1ID = $2 AND User2ID = $1)',
      [user1Username, user2Username]
    );

    if (result.rows.length > 0) {
      const status = result.rows[0].status;
      res.json({ status });
    } else {
      res.json({ status: 'none' }); // No request or friendship exists
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  addFriend,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getFriends,
  deleteFriend,
  checkFriendshipStatus
};
