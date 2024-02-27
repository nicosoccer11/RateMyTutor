const db = require('../config/db');

// Add a qualification
const addQualification = async (req, res) => {
    const { username, skill } = req.body;
  
    try {
      const result = await db.query(
        'INSERT INTO qualifications (UserID, Skill) VALUES ($1, $2) RETURNING *',
        [username, skill]
      );
  
      res.json({
        message: 'Qualification added successfully',
        qualification: result.rows[0]
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

// Edit a qualification
const editQualification = async (req, res) => {
  const { qualificationID } = req.params;
  const { skill } = req.body;

  try {
    const result = await db.query(
      'UPDATE qualifications SET Skill = $1 WHERE QualificationID = $2 RETURNING *',
      [skill, qualificationID]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Qualification not found');
    }

    res.json({
      message: 'Qualification updated successfully',
      qualification: result.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { 
    addQualification,
    editQualification
    };