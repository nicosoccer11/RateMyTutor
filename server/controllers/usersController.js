const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Create a new user with specified fields
const createUser = async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;
  try {
    const newUser = await db.query(
      'INSERT INTO users (Username, Password, FirstName, LastName, Email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, password, firstname, lastname, email]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error, check console for logs');
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await db.query('SELECT * FROM users');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error, check console for logs');
  }
};

// Get a user by their username
const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await db.query('SELECT * FROM users WHERE Username = $1', [username]);
    if (user.rows.length > 0) {
      res.json(user.rows[0]);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error, check console for logs');
  }
};

// Get a user's profile that is logged in
const getUserProfile = async (req, res) => {
  // Assuming authenticateToken middleware adds the username to req.user
  const username = req.user.username;

  try {
    // Fetch user information
    const userResult = await db.query('SELECT * FROM users WHERE Username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    const user = userResult.rows[0];

    // Fetch user's reviews as a tutor
    const reviewsResult = await db.query('SELECT * FROM reviews WHERE TutorReviewedID = $1', [username]);
    const reviews = reviewsResult.rows;

    // Combine user info and reviews in the response
    res.json({
      user: {
        username: user.username,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilepicture, // Note: Consider converting BYTEA to a suitable format
        averageRating: user.averagerating
      },
      reviews
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error, check console for logs');
  }
};


// Login a user
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
      // Query the database for the user
      const queryResult = await db.query('SELECT * FROM users WHERE Username = $1', [username]);
      const user = queryResult.rows[0];
  
      if (user && user.password === password) {
        // Passwords match, generate token
        const token = jwt.sign({ userId: user.username }, process.env.ACCESS_TOKEN_SECRET || 'yourSecretKey', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
      } else {
        // Authentication failed
        res.status(401).send('Authentication failed');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

// Export the functions
module.exports = {
  createUser,
  getAllUsers,
  getUserByUsername,
  loginUser,
  getUserProfile,
};
