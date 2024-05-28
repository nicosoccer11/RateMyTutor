const express = require('express');
const { getAllQualities } = require('../controllers/qualitiesController');
const router = express.Router();

// Route to get all qualities
router.get('/qualities/all', getAllQualities);

module.exports = router;