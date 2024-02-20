const db = require('../config/db');

// Create a new user
const createUser = async (req, res) => {
  const { username, password, firstname, lastname, email, bio, profilepicture, averagerating } = req.body;
  try {
    const newUser = await db.query(
      'INSERT INTO users (Username, Password, FirstName, LastName, Email, Bio, ProfilePicture, AverageRating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [username, password, firstname, lastname, email, bio, profilepicture, averagerating]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await db.query('SELECT * FROM users');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Export the functions
module.exports = {
  createUser,
  getAllUsers,
};
