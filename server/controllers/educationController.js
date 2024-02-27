const db = require('../config/db');

// Add a new education record
const addEducation = async (req, res) => {
  const { userID, school, degree } = req.body;

  try {
    const newEducation = await db.query(
      'INSERT INTO education (UserID, School, Degree) VALUES ($1, $2, $3) RETURNING *',
      [userID, school, degree]
    );

    res.json({
      message: 'Education added successfully',
      education: newEducation.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Edit an education record
const editEducation = async (req, res) => {
  const { educationID } = req.params;
  const { school, degree } = req.body;

  try {
    const updatedEducation = await db.query(
      'UPDATE education SET School = $1, Degree = $2 WHERE EducationID = $3 RETURNING *',
      [school, degree, educationID]
    );

    if (updatedEducation.rows.length === 0) {
      return res.status(404).send('Education record not found');
    }

    res.json({
      message: 'Education updated successfully',
      education: updatedEducation.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  addEducation,
  editEducation
};
