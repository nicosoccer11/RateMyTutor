const db = require('../config/db');

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

// Export the functions
module.exports = {
  createUser,
  getAllUsers,
  getUserByUsername,
};
