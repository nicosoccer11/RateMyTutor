import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Schedule.css';
import { DatePicker } from 'rsuite';
import "rsuite/DatePicker/styles/index.css";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


function Schedule() {
    const [meetingRequests, setMeetingRequests] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [friends, setFriends] = useState([]);
    const [meetingDuration, setMeetingDuration] = useState(30);

    const username = localStorage.getItem('user');

    useEffect(() => {
        console.log(selectedDate);
        if (username) {
            fetchMeetingRequests(username);
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
            fetchMeetingRequests(username);
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
                    timeFrame: selectedDate
                });
                console.log(username, selectedUser, selectedDate);
            } catch (error) {
                console.error('Error sending meeting requests:', error);
            }
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
        </div>
    );
}

export default Schedule;
