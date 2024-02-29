import React, { useState,useEffect } from 'react';
import './friend.css'; // Import CSS file
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Profile from '../User/Profile';
import axios from 'axios';
import Chat from '../Messages/Chat';

const Friends = () => {
  const [currentPage, setCurrentPage] = useState(null);
  const [otherUser, setOtherUser] = useState("test");
  

  // State to hold the list of friends
  const [friends, setFriends] = useState([]);
  const[username,setUsername]=useState(localStorage.getItem('user'));
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.post('http://localhost:5000/friends/get', {
          username,
        }).then((response) => {
          console.log(response);
          const data = response.data; // Assuming the data returned is an array of friends
          setFriends(data.friends); 
        });
        
      } catch (error) {
        // Handle error, such as setting an error state
        console.error('Error fetching data:', error);
      }
    };

  fetchData();
    return () => {
    };
  }, []);

  const handleSendMessage = (friendId) => {
    // Logic for sending a message to the friend with the given ID
    setOtherUser(friendId);
    console.log(`Sending message to ${friendId}, ${otherUser}`);
  };

  return (
    <div className="friend-list-container">
      <label>Friends</label>
      <div className="friend-list-box">
        <ul className="friend-list">
          {friends.map((friend) => (
            <li key={friend} className="friend-item">
              <img
                className="friend-avatar" 
                src={`https://via.placeholder.com/50?text=${friend}`}
                alt={friend}
              />
              <div className="friend-info">
                <h3>
                  <Link className='name' to={`/profile/${friend}`}>{friend}</Link>
                  
                  <button className ="message" onClick={() => handleSendMessage(friend)}><Link to={`/messages/${friend}`}>Message</Link></button>
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Routes>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/messages/:id" element={<Chat/>} />
      </Routes>
    </div>
  );
};

export default Friends;
