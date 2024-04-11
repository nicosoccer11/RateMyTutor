import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Schedule.css';
import { DatePicker } from 'rsuite';
import "rsuite/DatePicker/styles/index.css";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


function Schedule() {
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [friends, setFriends] = useState([]);
    const [meetingDuration, setMeetingDuration] = useState(30);
    const [showIncoming, setShowIncoming] = useState(true);

    const username = localStorage.getItem('user');

    useEffect(() => {
        console.log(selectedDate);
        if (username) {
            fetchOutgoing();
            fetchIncoming();
            getFriends();
        }
    }, [username]);

    const getFriends = async () => {
        try {
            const response = await axios.post('http://localhost:5000/friends/get', {
                username,
            });
            setFriends(response.data.friends);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    const fetchOutgoing = async () => {
        try {
            const response = await axios.post('http://localhost:5000/schedule/OutgoingRequests', {
                username: username
            });
            setOutgoingRequests(response.data.outgoingRequests);
            console.log("outgoing", response.data.outgoingRequests);
        } catch (error) {
            console.error('Error fetching outgoing meeting requests:', error);
        }
    };

    const fetchIncoming = async () => {
        try {
            const response = await axios.post('http://localhost:5000/schedule/get', {
                username: username
            });
            setIncomingRequests(response.data.meetingRequests);
            console.log("incoming", response.data.meetingRequests);
        } catch (error) {
            console.error('Error fetching incoming meeting requests:', error);
        }
    };

    const handleResponse = async (scheduleId, code) => {
        try {
            await axios.post(`http://localhost:5000/schedule/respond/${code}`, {
                scheduleId: scheduleId
            });
            fetchIncoming();
        } catch (error) {
            console.error('Error responding to meeting request:', error);
        }
    };

    const handleSendRequest = async () => {
        if (selectedUser) {
            try {
                const response = await axios.post('http://localhost:5000/schedule/post', {
                    user1Username: username,
                    user2Username: selectedUser,
                    start_time: selectedDate,
                    minutes: meetingDuration
                });
                console.log("Creating request:", username, selectedUser, selectedDate, meetingDuration);
            } catch (error) {
                console.error('Error sending meeting requests:', error);
            }
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.post(`http://localhost:5000/schedule/respond/1`, {
            });
            fetchIncoming();
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleDeclineRequest = async (requestId) => {
        try {
            await axios.post(`http://localhost:5000/schedule/respond/0`);
            fetchIncoming();
        } catch (error) {
            console.error('Error declining request:', error);
        }
    };

    return (
        <div>
            <h2>Schedule Request</h2>
            <div className="schedule-container">
                <div className="user-select">
                    <Dropdown
                        className='dropdown'
                        options={friends}
                        value={selectedUser}
                        onChange={(option) => setSelectedUser(option.value)}
                        placeholder="Select User"
                    />
                </div>
                <div className="duration-select">
                    <Dropdown
                        className='dropdown'
                        options={['15 minutes', '30 minutes', '45 minutes', '1 hour']}
                        value={meetingDuration === 60 ? '1 hour' : `${meetingDuration} minutes`}
                        onChange={(option) => setMeetingDuration(option.value === '1 hour' ? 60 : parseInt(option.value))}
                        placeholder="Select Duration"
                    />
                </div>
                <div className="date-picker">
                    <DatePicker
                        className='datepicker'
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        format="MM/dd/yyyy HH:mm"
                        placeholder="Select Date"
                    />
                </div>
                <div className="button-container">
                    <button className='button' onClick={handleSendRequest}>Send Request</button>
                </div>
            </div>
            <div className="pending-requests">
                <h2>Pending Meeting Requests</h2>
                <div className="request-toggle">
                    <button onClick={() => setShowIncoming(true)}>Incoming</button>
                    <button onClick={() => setShowIncoming(false)}>Outgoing</button>
                </div>
                {showIncoming ? (
                    <ul>
                        {incomingRequests.map(request => (
                            <li key={request.schedule_id}>
                                <span>{request.sender}</span>
                                <span>Start: {request.start_time}</span>
                                <span>End: {request.end_time}</span>
                                <button onClick={() => handleAcceptRequest(request.schedule_id)}>Accept</button>
                                <button onClick={() => handleDeclineRequest(request.schedule_id)}>Decline</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ul>
                        {outgoingRequests.map(request => (
                            <li key={request.schedule_id}>
                                <span>{request.receiver}</span>
                                <span>Start: {request.start_time}</span>
                                <span>End: {request.end_time}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Schedule;
