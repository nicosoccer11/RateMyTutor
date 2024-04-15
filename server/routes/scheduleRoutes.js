const express = require('express');
const {getMeetingRequests,sendMeeting,respondToRequest,hadMeeting,getOutgoingRequests,getAcceptedRequests} = require('../controllers/scheduleController');
const router = express.Router();


// route to get all meeting requests (array of the database rows)
// this is for tutors to see anyone who wants their service
router.post('/schedule/get', getMeetingRequests);

// route to send a request to tutor for a meeting
router.post('/schedule/post', sendMeeting);

// for /schedule/respond a code of 0 means reject request, and 1 means accept request, 2 is pending
// when code of 0 is passed, the entry currently gets deleted. Also, functionallity is buggy when there are multiple requests. #TODO
router.post('/schedule/respond/:code', respondToRequest);

// route to check if a user had the tutor before (for reviews)
// it already calculates when the meeting ends
router.get('/schedule/flag', hadMeeting);

// route to check if a user had the tutor before (for reviews)
router.post('/schedule/OutgoingRequests', getOutgoingRequests);

// route to get tutor's scheduled meetings
router.post('/schedule/get/scheduledRequests', getAcceptedRequests);
module.exports = router;