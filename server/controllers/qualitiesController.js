const db = require('../config/db');

// Get all qualities
const getAllQualities = async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM qualities');
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

module.exports = { getAllQualities };