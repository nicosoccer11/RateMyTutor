const db = require('../config/db');

const sendMeeting = async (req, res) => {
// user1 is the sender and user2 is the receiver (tutor)
  const { user1Username, user2Username, start_time, minutes} = req.body; 
  
  // make sure there is a starting time
  if (!start_time || !minutes){
    return res.status(400).send('User needs to provide a timestamp for event');
  }
  // Validate that user1Username and user2Username are different
  if (user1Username === user2Username) {
    return res.status(400).send('Users cannot schedule with themselves.');
  }

  try {
    let endTime = new Date(start_time);
    endTime.setMinutes(endTime.getMinutes() + minutes);
    const newScheduleRequest = await db.query(
      'INSERT INTO schedule (sender, receiver, start_time, status, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user1Username, user2Username, start_time, 2, endTime]
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

const respondToRequest = async (req, res) => {
  const {meeting_id} = req.body;
  const {code} = req.params;
  try {
    // Check if the meeting request exists
    const existingRequest = await db.query(
      'SELECT * FROM schedule WHERE schedule_id = $1',
      [meeting_id]
    );

    // If the meeting request exists
    if (existingRequest.rows.length > 0) {
      if (code === '0') { // If code is 0, delete the meeting request
        await db.query('DELETE FROM schedule WHERE schedule_id = $1', [meeting_id]); 
        return res.json({
          message: `Meeting request with ID ${meeting_id} deleted successfully.`,
        });
      } else if (code === '1') { // If code is 1, accept the meeting request
        await db.query('UPDATE schedule SET status = 1 WHERE schedule_id = $1', [meeting_id]);
        return res.json({
          message: `Meeting request with ID ${meeting_id} accepted successfully.`,
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
// TODO: do error checking for when there is nothing there (so it does not return null)
const getMeetingRequests = async (req, res) => {
  const { username } = req.body; 
  //console.log(req.body);
  try {
    const meetingRequests = await db.query(
      'SELECT * FROM schedule WHERE receiver = $1 AND status = 2',
      [username]
    );
    //console.log(meetingRequests);
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

// Function to get all the schedules meetings for tutor
const getAcceptedRequests = async (req, res) => {
  const { username } = req.body; 
  console.log(username);
  try {
    const meetingRequests = await db.query(
      'SELECT * FROM schedule WHERE receiver = $1 AND status = ',
      [username]
    );
    console.log(meetingRequests);
    res.json({
      message: 'Scheduled meetings retrieved successfully',
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

// Function to check if a student/user had a meeting with the tutor before and if it has passed
const hadMeeting = async (req, res) => {
  const { student, tutor } = req.body; 
  try {
    // Fetch all meetings between the student and tutor
    const meetings = await db.query(
      'SELECT * FROM schedule WHERE sender = $1 AND receiver = $2 AND status = 1',
      [student, tutor]
    );

    // Check if any meeting has passed
    let hadMeeting = false;
    for (const meeting of meetings.rows) {
      if (currentDate >= meeting.end_time) { 
        hadMeeting = true;
        break;
      }
    }
    if (hadMeeting) {
      res.json({
        message: 'Meeting request found and passed',
        hadMeeting: true
      });
    } else {
      res.json({
        message: 'No meeting request found or none has passed',
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

// Function to get all the outgoing requests of student
const getOutgoingRequests = async (req, res) => {
  const { username } = req.body; 
  //console.log(username);
  try {
    const outgoingRequests = await db.query(
      'SELECT * FROM schedule WHERE sender = $1',
      [username]
    );
    //console.log(outgoingRequests.rows);
    res.json({
      message: 'Outgoing requests retrieved successfully',
      outgoingRequests: outgoingRequests.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
 getMeetingRequests,
 respondToRequest,
 sendMeeting,
 hadMeeting,
 getOutgoingRequests,
 getAcceptedRequests,
};