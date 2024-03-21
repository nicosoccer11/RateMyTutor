const db = require('../config/db');

// Create a new user with specified fields
const createUser = async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;

  // Validate that the username does not contain spaces
  if (/\s/.test(username)) {
    return res.status(400).send('Username must not contain spaces.');
  }
  // Validate that the password field is not empty
  if (!password) {
    return res.status(400).send('Password field  cannot be empty');
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

    // Fetch user's education
    const educationResult = await db.query('SELECT * FROM education WHERE Username = $1', [username]);
    const education = educationResult.rows;

    // Fetch user's qualifications
    const qualificationsResult = await db.query('SELECT * FROM qualifications WHERE Username = $1', [username]);
    const qualifications = qualificationsResult.rows;

    // Combine user info, reviews, education, qualifications, and average rating in the response
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
        longDescription: user.longdescription,
        education,
        qualifications
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

// Search users by username
const searchUsersByUsername = async (req, res) => {
  const searchString = req.query.username;
  const requesterUsername = req.query.requester;

  if (!searchString) {
    return res.status(400).send('Search username is required.');
  }

  try {
    // Step 1: Fetch matching users
    const usersQuery = `
      SELECT Username FROM users
      WHERE Username ILIKE $1
      AND Username <> $2
    `;
    const searchValue = `%${searchString}%`;
    const usersResult = await db.query(usersQuery, [searchValue, requesterUsername]);
    let users = usersResult.rows;

    // Step 2: Check friendship status for each user
    for (let i = 0; i < users.length; i++) {
      const friendCheckQuery = `
        SELECT EXISTS (
          SELECT 1 FROM friends
          WHERE (LOWER(User1ID) = LOWER($1) AND LOWER(User2ID) = LOWER($2))
          OR (LOWER(User1ID) = LOWER($2) AND LOWER(User2ID) = LOWER($1))
        ) AS "isFriend"
      `;
      const friendCheckResult = await db.query(friendCheckQuery, [requesterUsername, users[i].username]);
      users[i].isFriend = friendCheckResult.rows[0].isFriend;
    }

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error, check console for logs');
  }
};

// Unified search function
const searchEverything = async (req, res) => {
  const { term, requesterUsername } = req.query;

  if (!term) {
    return res.status(400).send('A search term is required.');
  }

  try {
    // Modified query to also fetch usernames related to education
    const userQuery = `
      SELECT DISTINCT u.Username,
      EXISTS (
        SELECT 1 FROM friends
        WHERE (User1ID = $2 AND User2ID = u.Username) OR (User1ID = u.Username AND User2ID = $2)
      ) AS "isFriend"
      FROM users u
      LEFT JOIN qualifications q ON u.Username = q.Username
      LEFT JOIN education e ON u.Username = e.Username
      WHERE (u.Username ILIKE $1 OR q.Skill ILIKE $1 OR e.School ILIKE $1 OR e.Degree ILIKE $1) 
      AND u.Username <> $2
    `;

    // Query to search posts
    const postsQuery = `
      SELECT p.Content, p.UserID
      FROM posts p
      WHERE p.Content ILIKE $1
    `;

    // Perform the searches
    const searchValue = `%${term}%`;
    const users = await db.query(userQuery, [searchValue, requesterUsername]);
    const posts = await db.query(postsQuery, [searchValue]);

    // Aggregate results
    const results = {
      usernames: users.rows, // Including usernames related to qualifications and education
      posts: posts.rows
    };

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Export the functions
module.exports = {
  createUser,
  getAllUsers,
  loginUser,
  getUserProfile,
  updateUser,
  searchUsersByUsername,
  searchEverything
};
