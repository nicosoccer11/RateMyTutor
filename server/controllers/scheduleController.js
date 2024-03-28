const db = require('../config/db');

const sendMeeting = async (req, res) => {
// user1 is the sender and user2 is the receiver (tutor)
  const { user1Username, user2Username, timeFrame } = req.body; 
  
  // make sure there is a timeFrame
  if (!timeFrame){
    return res.status(400).send('User needs to provide a timestamp for event');
  }
  // Validate that user1Username and user2Username are different
  if (user1Username === user2Username) {
    return res.status(400).send('Users cannot schedule with themselves.');
  }

  try {
    const newScheduleRequest = await db.query(
      'INSERT INTO schedule (sender, receiver, timeframe, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [user1Username, user2Username, timeFrame, 2]
    );

    res.json({
      message: 'Schedule successfully sent',
      friendship: newScheduleRequest.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    if (err.code === "23503") { // PostgreSQL foreign key violation error code
      res.status(400).send('One or both users do not exist.');
    } else {
      res.status(500).send('Server Error');
    }
  }
};

const rejectMeetingRequest = async (req, res) => {
  const { sender, receiver } = req.body;
  const {code} = req.params;
 
  try {
    // Check if the meeting request exists
    const existingRequest = await db.query(
      'SELECT * FROM schedule WHERE sender = $1 AND receiver = $2 AND status = 2',
      [sender, receiver]
    );

    // If the meeting request exists
    if (existingRequest.rows.length > 0) {
      const requestId = existingRequest.rows[0].schedule_id;

      if (code === '0') { // If code is 0, delete the meeting request
        await db.query('DELETE FROM schedule WHERE schedule_id = $1', [requestId]);
        return res.json({
          message: `Meeting request with ID ${requestId} deleted successfully.`,
        });
      } else if (code === '1') { // If code is 1, accept the meeting request
        await db.query('UPDATE schedule SET status = 1 WHERE schedule_id = $1', [requestId]);
        return res.json({
          message: `Meeting request with ID ${requestId} accepted successfully.`,
        });
      } else {
        return res.status(400).send('Invalid code provided.');
      }
    } else {
      return res.status(404).send('Meeting request not found.');
    }
  } catch (err) {
    console.error(err.message);
    if (err.code === "23503") {
      res.status(400).send('One or both users do not exist.');
    } else {
      res.status(500).send('Server Error');
    }
  }
};

// Function to get all the incoming requests for the tutor
const getMeetingRequests = async (req, res) => {
  const { username } = req.body; 
  console.log(username);
  try {
    const meetingRequests = await db.query(
      'SELECT * FROM schedule WHERE receiver = $1 AND status = 2',
      [username]
    );
    console.log(meetingRequests);
    res.json({
      message: 'Meeting requests retrieved successfully',
      meetingRequests: meetingRequests.rows
    });

  } catch (err) {
    console.error(err.message);
    if (err.code === "23503") { // PostgreSQL foreign key violation error code
      res.status(400).send('One or both users do not exist.');
    } else {
      res.status(500).send('Server Error');
    }
  }
};

// Function to get check if a student/user had the tutor before (so they can write reviews)
const hadMeeting = async (req, res) => {
  const { student, tutor } = req.body; 
  try {
    const meetingRequest = await db.query(
      'SELECT * FROM schedule WHERE sender = $1 AND receiver = $2 AND status = 1 LIMIT 1',
      [student, tutor]
    );

    if (meetingRequest.rows.length > 0) {
      res.json({
        message: 'Meeting request found',
        hadMeeting: true
      });
    } else {
      res.json({
        message: 'No meeting request found',
        hadMeeting: false
      });
    }

  } catch (err) {
    console.error(err.message);
    if (err.code === "23503") { // PostgreSQL foreign key violation error code
      res.status(400).send('One or both users do not exist.');
    } else {
      res.status(500).send('Server Error');
    }
  }
};


module.exports = {
 getMeetingRequests,
 rejectMeetingRequest,
 sendMeeting,
 hadMeeting,
};
