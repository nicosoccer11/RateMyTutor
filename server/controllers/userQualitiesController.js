// controllers/userQualitiesController.js
const db = require('../config/db');

// Link a user to a quality
const addUserQuality = async (req, res) => {
  const { username, qualityId } = req.body;

  try {
    const result = await db.query('INSERT INTO user_qualities (Username, QualityID) VALUES ($1, $2) RETURNING *', [username, qualityId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Remove a link between a user and a quality
const removeUserQuality = async (req, res) => {
  const { username, qualityId } = req.body;

  try {
    await db.query('DELETE FROM user_qualities WHERE Username = $1 AND QualityID = $2', [username, qualityId]);
    res.send('Quality removed successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all qualities for a user
const getUserQualities = async (req, res) => {
  const { username } = req.params;

  try {
    const result = await db.query('SELECT uq.QualityID FROM user_qualities uq WHERE uq.Username = $1', [username]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { addUserQuality, removeUserQuality, getUserQualities };
