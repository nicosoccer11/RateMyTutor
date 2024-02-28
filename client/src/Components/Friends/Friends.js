import React, { useState } from 'react';
import './friend.css'; // Import CSS file
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Profile from '../User/Profile';

const Friends = () => {
  const [currentPage, setCurrentPage] = useState(null);

  // State to hold the list of friends
  const [friends, setFriends] = useState([
    { id: 'test', name: 'John' },
    { id: 'User test', name: 'Jane' },
    { id: 3, name: 'Doe' },
  ]);

  const handleSendMessage = (friendId) => {
    // Logic for sending a message to the friend with the given ID
    console.log(`Sending message to ${friendId}`);
  };

  return (
    <div className="friend-list-container">
      <label>Friends</label>
      <div className="friend-list-box">
        <ul className="friend-list">
          {friends.map((friend) => (
            <li key={friend.id} className="friend-item">
              <img
                className="friend-avatar"
                src={`https://via.placeholder.com/50?text=${friend.name}`}
                alt={friend.name}
              />
              <div className="friend-info">
                <h3>
                  <Link className='name' to={`/profile/${friend.id}`}>{friend.name}</Link>
                  <button className ="message" onClick={() => handleSendMessage(friend.id)}>Message</button>
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Routes>
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </div>
  );
};
//test
export default Friends;
