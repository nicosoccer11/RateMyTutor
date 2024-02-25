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

async function fetchUserByUsername(username) {
  try {
    const result = await db.query('SELECT * FROM users WHERE Username = $1', [username]);

    if (result.rows.length > 0) {
      // console.log("Function")
      // console.log(result.rows[0])
      // console.log("Function")
      return result.rows[0]; // Return the user object
    } else {
      return null; // No user found
    }
  } catch (err) {
    console.error(err.message);
    throw new Error('Server Error, check console for logs'); // Propagate error
  }
}

// Get a user by their username
const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await fetchUserByUsername(username);
    if (user) {
      res.status(200).json({ message: user });
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

// Updating user's profile picture
const UserUploadPicture = async (imageName) => {
  //const { picture } = req.params;
  try {
    //await db.query('SELECT * FROM users WHERE Username = $1', [username]);
    await db.query('UPDATE users SET profilepicture = $1 WHERE username = $2', [imageName, 'User test']);

    // if (user.rows.length > 0) {
    //   res.json(user.rows[0]);
    // } else {
    //   res.status(404).send('User not found');
    // }
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
  UserUploadPicture,
  fetchUserByUsername,
};
