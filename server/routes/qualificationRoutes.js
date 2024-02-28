const express = require('express');
const { addQualification, editQualification, deleteQualification } = require('../controllers/qualificationsController');
const router = express.Router();

// Route to add a new qualification
router.post('/qualifications/add', addQualification);

// Route to partially update a specific qualification
router.patch('/qualifications/edit/:qualificationID', editQualification);

// Route to delete a specific qualification
router.delete('/qualifications/delete/:qualificationID', deleteQualification);

module.exports = router;
