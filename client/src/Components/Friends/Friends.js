import React, { useState } from 'react';
import './friend.css'; // Import CSS file
import { Link } from 'react-router-dom';
import Profile from '../User/Profile';


const Friends = () => {
    const [currentPage, setCurrentPage] = useState(null);
    
  // State to hold the list of friends
  const [friends, setFriends] = useState([
    { id: 1, name: 'John', status: 'Online' },
    { id: 2, name: 'Jane', status: 'Offline' },
    { id: 3, name: 'Doe', status: 'Online' },
  ]);

  return (
    <div className="friend-list-container">
      <label>Friends</label>
      <div className="friend-list-box">
        <ul className="friend-list">
          {friends.map((friend) => (
            <li  key={friend.id} className="friend-item">
              <img
                className="friend-avatar"
                src={`https://via.placeholder.com/50?text=${friend.name}`}
                alt={friend.name} 
              />
              <div className="friend-info">
                <h3><a href="/profile">{friend.name}</a></h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Friends;
