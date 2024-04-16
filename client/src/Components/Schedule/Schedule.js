import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './Schedule.css';
import { DatePicker } from 'rsuite';
import "rsuite/DatePicker/styles/index.css";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';



function Schedule() {
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

    useEffect(() => {
        if (username) {
            fetchOutgoing();
            fetchIncoming();
            fetchTutor();
            fetchStudent();
            getFriends();
        }
    }, [username]);

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
            for (let user of meetings) {
                const img = await fetchPicture(user.other);
                newImages[user.other] = img;
            }
            setImages(newImages);
        };

        fetchImages();
    }, [incomingRequests, outgoingRequests, meetings]);

    const fetchPicture = async (user) => {
        try {
            const response = await axios.get(`http://localhost:5000/image/get/${user}`);
            return response.data.imageUrl;
        } catch (error) {
            console.error('Error fetching image:', error);
            return null;
        }
    };

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

    const formatDateTimeHours = (dateTimeString) => {
        const options = {
            hour: 'numeric',
            minute: 'numeric',
        };
        const date = new Date(dateTimeString);
        return date.toLocaleString(undefined, options);
    };

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
        } catch (error) {
            console.error('Error fetching incoming meeting requests:', error);
        }
    };

    const fetchTutor = async () => {
        try {
            const response = await axios.post('http://localhost:5000/schedule/get/scheduledRequests', {
                username: username
            });
            setMeetingsWithTutors(response.data.meetingRequests);
            // console.log("tutor", response.data.meetingRequests);
        } catch (error) {
            console.error('Error fetching outgoing meeting requests:', error);
        }
    };

    const fetchStudent = async () => {
        try {
            const response = await axios.post('http://localhost:5000/schedule/get/scheduledRequests', {
                username: username
            });
            setMeetingsWithStudents(response.data.meetingRequests);
            // console.log("student", response.data.meetingRequests);
        } catch (error) {
            console.error('Error fetching outgoing meeting requests:', error);
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
                // console.log("Creating request:", username, selectedUser, selectedDate, meetingDuration);
                if (response) {
                    fetchOutgoing();
                }
            } catch (error) {
                console.error('Error sending meeting requests:', error);
            }
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.post(`http://localhost:5000/schedule/respond/1`, {
                meeting_id: requestId
            });
            fetchIncoming();
            fetchStudent();
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleDeclineRequest = async (requestId) => {
        try {
            await axios.post(`http://localhost:5000/schedule/respond/0`, {
                meeting_id: requestId
            });
            fetchIncoming();
            fetchOutgoing();
        } catch (error) {
            console.error('Error declining request:', error);
        }
    };

    return (
        <div>
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
                <ul>
                    {meetingsWithTutors.map(request => (
                        <li key={request.schedule_id}>
                            <div className="user-info">
                                {images[request.other] && (
                                    <img
                                        className="user-avatar"
                                        src={images[request.other]}
                                        alt={request.other}
                                    />
                                )}
                                <span><Link className='name' to={`/profile/${request.other}`}>{request.other}</Link></span>
                            </div>
                            <span>{formatDateTime(request.start_time)}-{formatDateTimeHours(request.end_time)}</span>
                            <button onClick={() => handleDeclineRequest(request.schedule_id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='current'>
                <h2>Meetings With Students</h2>
                <ul>
                    {meetingsWithStudents.map(request => (
                        <li key={request.schedule_id}>
                            <div className="user-info">
                                {images[request.other] && (
                                    <img
                                        className="user-avatar"
                                        src={images[request.other]}
                                        alt={request.other}
                                    />
                                )}
                                <span><Link className='name' to={`/profile/${request.other}`}>{request.other}</Link></span>
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
