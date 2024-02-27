const express = require('express');
const { addQualification, editQualification } = require('../controllers/qualificationsController');
const router = express.Router();

// Route to add a new qualification
router.post('/qualifications/add', addQualification);

// Route to partially update a specific qualification
router.patch('/qualifications/edit/:qualificationID', editQualification);

module.exports = router;
