const express = require('express');
const {getMeetingRequests,sendMeeting,rejectMeetingRequest } = require('../controllers/scheduleController');
const router = express.Router();


// Route to submit a new review
router.get('/schedule/get', getMeetingRequests);
router.post('/schedule/post', sendMeeting);
// for /schudle/respond a code of 0 means reject request, and 1 means accept request
router.post('/schedule/respond/:code', rejectMeetingRequest);


module.exports = router;