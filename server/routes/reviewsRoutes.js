// routes/reviewsRoutes.js
const express = require('express');
const router = express.Router();
const { addReview } = require('../controllers/reviewsController');

// Route to submit a new review
router.post('/reviews', addReview);

module.exports = router;