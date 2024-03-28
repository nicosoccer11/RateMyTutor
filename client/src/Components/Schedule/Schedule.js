import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Schedule = () => {
  const [meetingRequests, setMeetingRequests] = useState([]);
  const username = localStorage.getItem('user'); // Retrieve the current user's username

  useEffect(() => {
    if (username) { // Check if username is available
      fetchMeetingRequests(username);
    }
  }, [username]); // Trigger the effect whenever username changes

  const fetchMeetingRequests = async (username) => {
    try {
      const response = await axios.get('http://localhost:5000/schedule/get', {
        params: { username: username }
      });
      setMeetingRequests(response.data.meetingRequests);
    } catch (error) {
      console.error('Error fetching meeting requests:', error);
    }
  };

  const handleResponse = async (scheduleId, code) => {
    try {
      await axios.post(`http://localhost:5000/schedule/respond/${code}`, {
        scheduleId: scheduleId
      });
      // After responding, fetch meeting requests again to update the list
      fetchMeetingRequests(username); // Pass the username
    } catch (error) {
      console.error('Error responding to meeting request:', error);
    }
  };

  return (
    <div>
      <h2>Meeting Requests</h2>
      <ul>
        {meetingRequests.map(request => (
          <li key={request.schedule_id}>
            <div>
              <p>Request ID: {request.schedule_id}</p>
              <p>Sender: {request.sender}</p>
              <p>Receiver: {request.receiver}</p>
              <p>Timeframe: {request.timeframe}</p>
              <p>Status: {request.status === 2 ? 'Pending' : 'Accepted'}</p>
              <button onClick={() => handleResponse(request.schedule_id, 0)}>Reject</button>
              <button onClick={() => handleResponse(request.schedule_id, 1)}>Accept</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Schedule;
