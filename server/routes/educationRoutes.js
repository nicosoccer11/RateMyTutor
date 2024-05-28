const express = require('express');
const { addEducation, editEducation, deleteEducation } = require('../controllers/educationController');
const router = express.Router();

// Route to add a new education record
router.post('/education/add', addEducation);

// Route to edit an existing education record
router.patch('/education/edit/:educationID', editEducation);

// Route to delete an existing education record
router.delete('/education/delete/:educationID', deleteEducation);

module.exports = router;
