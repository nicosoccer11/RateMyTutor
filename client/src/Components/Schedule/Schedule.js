import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './Schedule.css';
import { DatePicker } from 'rsuite';
import "rsuite/DatePicker/styles/index.css";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';



function Schedule() {
    // State variables
    const searchLocation = useLocation();
    const queryParams = new URLSearchParams(searchLocation.search);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [meetingsWithStudents, setMeetingsWithStudents] = useState([]);
    const [meetingsWithTutors, setMeetingsWithTutors] = useState([]);
    const [selectedUser, setSelectedUser] = useState(queryParams.get('q') || null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [friends, setFriends] = useState([]);
    const [meetingDuration, setMeetingDuration] = useState(30);
    const [images, setImages] = useState({});

    const username = localStorage.getItem('user');

    // useEffect to fetch data when username changes
    useEffect(() => {
        if (username) {
            fetchOutgoing();
            fetchIncoming();
            fetchTutor();
            fetchStudent();
            getFriends();
        }
    }, [username]);

    // useEffect to fetch images when meeting data changes
    useEffect(() => {
        const fetchImages = async () => {
            const newImages = {};
            for (let user of incomingRequests) {
                const img = await fetchPicture(user.sender);
                newImages[user.sender] = img;
            }
            for (let user of outgoingRequests) {
                const img = await fetchPicture(user.receiver);
                newImages[user.receiver] = img;
            }
            for (let user of meetingsWithStudents) {
                const img = await fetchPicture(user.sender);
                newImages[user.sender] = img;
            }
            for (let user of meetingsWithTutors) {
                const img = await fetchPicture(user.receiver);
                newImages[user.receiver] = img;
            }
            setImages(newImages);
        };

        fetchImages();
    }, [incomingRequests, outgoingRequests, meetingsWithTutors, meetingsWithStudents]);

    // Function to fetch user image
    const fetchPicture = async (user) => {
        try {
            const response = await axios.get(`http://localhost:5000/image/get/${user}`);
            return response.data.imageUrl;
        } catch (error) {
            console.error('Error fetching image:', error);
            return null;
        }
    };

    // Function to format date and time
    const formatDateTime = (dateTimeString) => {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        const date = new Date(dateTimeString);
        return date.toLocaleString(undefined, options);
    };

    // Function to format date and time with hours and minutes
    const formatDateTimeHours = (dateTimeString) => {
        const options = {
            hour: 'numeric',
            minute: 'numeric',
        };
        const date = new Date(dateTimeString);
        return date.toLocaleString(undefined, options);
    };

    // Function to fetch friends
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

    // Function to fetch outgoing meeting requests
    const fetchOutgoing = async () => {
        try {
            const response = await axios.post('http://localhost:5000/schedule/OutgoingRequests', {
                username: username
            });
            setOutgoingRequests(response.data.outgoingRequests);
        } catch (error) {
            console.error('Error fetching outgoing meeting requests:', error);
        }
    };

    // Function to fetch incoming meeting requests
    const fetchIncoming = async () => {
        try {
            const response = await axios.post('http://localhost:5000/schedule/get', {
                username: username
            });
            setIncomingRequests(response.data.meetingRequests);
        } catch (error) {
            console.error('Error fetching incoming meeting requests:', error);
        }
    };

    // Function to fetch meeting requests where user is a tutor
    const fetchTutor = async () => {
        try {
            const response = await axios.post('http://localhost:5000/schedule/get/sentRequests', {
                username: username
            });
            setMeetingsWithTutors(response.data.meetingRequests);
        } catch (error) {
            console.error('Error fetching outgoing meeting requests:', error);
        }
    };

    // Function to fetch meeting requests where user is a student
    const fetchStudent = async () => {
        try {
            const response = await axios.post('http://localhost:5000/schedule/get/scheduledRequest', {
                username: username
            });
            setMeetingsWithStudents(response.data.meetingRequests);
        } catch (error) {
            console.error('Error fetching outgoing meeting requests:', error);
        }
    };

    // Function to handle sending a meeting request
    const handleSendRequest = async () => {
        if (selectedUser) {
            try {
                const response = await axios.post('http://localhost:5000/schedule/post', {
                    user1Username: username,
                    user2Username: selectedUser,
                    start_time: selectedDate,
                    minutes: meetingDuration
                });
                if (response) {
                    fetchOutgoing();
                }
            } catch (error) {
                console.error('Error sending meeting requests:', error);
            }
        }
    };

    // Function to handle accepting a meeting request
    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.post(`http://localhost:5000/schedule/respond/1`, {
                meeting_id: requestId
            });
            fetchIncoming();
            fetchStudent();
            fetchTutor();
            fetchStudent();
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    // Function to handle declining a meeting request
    const handleDeclineRequest = async (requestId) => {
        try {
            await axios.post(`http://localhost:5000/schedule/respond/0`, {
                meeting_id: requestId
            });
            fetchIncoming();
            fetchOutgoing();
            fetchTutor();
            fetchStudent();
        } catch (error) {
            console.error('Error declining request:', error);
        }
    };

    return (
        <div className='schedule'>
            <h2 className='header'>Schedule Request</h2>
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
                <DatePicker
                    className='datepicker'
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    format="MM/dd/yyyy hh:mm aa"
                    placeholder="Select Date"
                    showMeridian
                />
                <div className="button-container">
                    <button className='button' onClick={handleSendRequest}>Send Request</button>
                </div>
            </div>
            <div className='current'>
                <h2>Meetings With Tutors</h2>
                {meetingsWithTutors.length === 0 && (
                    <div className="message">
                        <p className="message-text">No meetings with tutors.</p>
                    </div>
                )}
                <ul>
                    {meetingsWithTutors.map(request => (
                        <li key={request.schedule_id}>
                            <div className="user-info">
                                {images[request.receiver] && (
                                    <img
                                        className="user-avatar"
                                        src={images[request.receiver]}
                                        alt={request.receiver}
                                    />
                                )}
                                <span><Link className='name' to={`/profile/${request.receiver}`}>{request.receiver}</Link></span>
                            </div>
                            <span>{formatDateTime(request.start_time)}-{formatDateTimeHours(request.end_time)}</span>
                            <button onClick={() => handleDeclineRequest(request.schedule_id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='current'>
                <h2>Meetings With Students</h2>
                {meetingsWithStudents.length === 0 && (
                    <div className="message">
                        <p className="message-text">No meetings with students.</p>
                    </div>
                )}
                <ul>
                    {meetingsWithStudents.map(request => (
                        <li key={request.schedule_id}>
                            <div className="user-info">
                                {images[request.sender] && (
                                    <img
                                        className="user-avatar"
                                        src={images[request.sender]}
                                        alt={request.sender}
                                    />
                                )}
                                <span><Link className='name' to={`/profile/${request.sender}`}>{request.sender}</Link></span>
                            </div>
                            <span>{formatDateTime(request.start_time)}-{formatDateTimeHours(request.end_time)}</span>
                            <button onClick={() => handleDeclineRequest(request.schedule_id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="pending-requests">
                <div className="incoming-requests">
                    <h2>Incoming Meeting Requests</h2>
                    {incomingRequests.length === 0 && (
                        <div className="message">
                            <p className="message-text">No incoming meeting requests.</p>
                        </div>
                    )}
                    <ul>
                        {incomingRequests.map(request => (
                            <li key={request.schedule_id}>
                                {images[request.sender] && <img
                                    className="user-avatar"
                                    src={images[request.sender]}
                                    alt={request.sender}
                                />}
                                <span><Link className='name' to={`/profile/${request.sender}`}>{request.sender}</Link></span>
                                <span>{formatDateTime(request.start_time)}-{formatDateTimeHours(request.end_time)}</span>
                                <button onClick={() => handleAcceptRequest(request.schedule_id)}>Accept</button>
                                <button onClick={() => handleDeclineRequest(request.schedule_id)}>Decline</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="outgoing-requests">
                    <h2>Outgoing Meeting Requests</h2>
                    {outgoingRequests.length === 0 && (
                        <div className="message">
                            <p className="message-text">No outgoing meeting requests.</p>
                        </div>
                    )}
                    <ul>
                        {outgoingRequests.map(request => (
                            <li key={request.schedule_id}>
                                {images[request.receiver] && <img
                                    className="user-avatar"
                                    src={images[request.receiver]}
                                    alt={request.receiver}
                                />}
                                <span><Link className='name' to={`/profile/${request.receiver}`}>{request.receiver}</Link></span>
                                <span>{formatDateTime(request.start_time)}-{formatDateTimeHours(request.end_time)}</span>
                                <button onClick={() => handleDeclineRequest(request.schedule_id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
}

export default Schedule;
