const db = require('../config/db');

// Create a new user with specified fields
const createUser = async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;

  // Validate that the username does not contain spaces
  if (/\s/.test(username)) {
    return res.status(400).send('Username must not contain spaces.');
  }

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

// Get a user's profile
const getUserProfile = async (req, res) => {
  const username = req.headers['username'];

  try {
    // Fetch user information
    const userResult = await db.query('SELECT * FROM users WHERE Username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    const user = userResult.rows[0];

    // Fetch user's reviews as a tutor and calculate average rating
    const reviewsResult = await db.query('SELECT * FROM reviews WHERE TutorReviewedID = $1', [username]);
    const reviews = reviewsResult.rows;

    // Calculate average rating
    const averageRatingResult = await db.query(
      'SELECT AVG(Score) as averageRating FROM reviews WHERE TutorReviewedID = $1',
      [username]
    );
    const averageRating = averageRatingResult.rows[0].averagerating ? parseFloat(averageRatingResult.rows[0].averagerating).toFixed(2) : null;

    // Combine user info, reviews, and average rating in the response
    res.json({
      user: {
        username: user.username,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilepicture, 
        averageRating: averageRating,
        shortDescription: user.shortdescription,
        longDescription: user.longdescription
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
      // Passwords match, send username back
      res.json({ message: 'Login successful', username: user.username });
    } else {
      // Authentication failed
      res.status(401).send('Authentication failed');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user information
const updateUser = async (req, res) => {
  const { username } = req.params; // Assuming username is in the URL
  const updates = req.body; // All updates are passed in the request body

  // Construct the SET part of the SQL query dynamically based on provided fields
  const setString = Object.keys(updates).map(
    (key, index) => `${key} = $${index + 2}`
  ).join(', ');

  // Ensure that only fields that exist in the users table can be updated
  if (!setString) {
    return res.status(400).send('No valid fields provided for update.');
  }

  try {
    // Execute the update query, passing the username and values to update
    await db.query(
      `UPDATE users SET ${setString} WHERE Username = $1 RETURNING *`,
      [username, ...Object.values(updates)]
    );

    res.send('User updated successfully.');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error, check console for logs');
  }
};


// Export the functions
module.exports = {
  createUser,
  getAllUsers,
  getUserByUsername,
  loginUser,
  getUserProfile,
  updateUser,
};
