const express = require('express');
const { addEducation, editEducation } = require('../controllers/educationController');
const router = express.Router();

// Route to add a new education record
router.post('/education/add', addEducation);

// Route to edit an existing education record
router.patch('/education/edit/:educationID', editEducation);

module.exports = router;
