// controllers/reviewsController.js
const db = require('../config/db');

// Function to add a new review
const addReview = async (req, res) => {
  const { score, paragraph, userReviewingID, tutorReviewedID } = req.body;

  // Input validation (basic example)
  if(score < 1 || score > 10) {
    return res.status(400).send('Score must be between 1 and 10.');
  }

  try {
    const newReview = await db.query(
      'INSERT INTO reviews (Score, Paragraph, UserReviewingID, TutorReviewedID) VALUES ($1, $2, $3, $4) RETURNING *',
      [score, paragraph, userReviewingID, tutorReviewedID]
    );
    res.json(newReview.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error, check console for logs');
  }
};

module.exports = {
  addReview,
};
