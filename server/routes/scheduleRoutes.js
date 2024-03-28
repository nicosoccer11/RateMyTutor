const express = require('express');
const {getMeetingRequests,sendMeeting,rejectMeetingRequest,hadMeeting } = require('../controllers/scheduleController');
const router = express.Router();


// route to get all meeting requests (array of the database rows)
router.get('/schedule/get', getMeetingRequests);
// route to send a request to tutor for a meeting
router.post('/schedule/post', sendMeeting);
// for /schedule/respond a code of 0 means reject request, and 1 means accept request
router.post('/schedule/respond/:code', rejectMeetingRequest);
// route to check if a user had the tutor before (for reviews)
router.get('/schedule/flag', hadMeeting);

module.exports = router;