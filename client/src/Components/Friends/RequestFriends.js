import React, { useState, useEffect } from 'react';
import './RequestFriend.css'; // Import CSS file
import axios from 'axios';

const RequestFriends = ({ users }) => {

    const [images, setImages] = useState({});

  const fetchPicture = async (user) => {
    try {
      const response = await axios.get(`http://localhost:5000/image/get/${user}`);
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      for (let user of users) {
        const img = await fetchPicture(user.username);
        newImages[user.username] = img;
      }
      setImages(newImages);
    };

    fetchImages();
  }, [users]);

  const handleAddUser = async (user1Username) => {
    try {
      const response = await axios.post(`http://localhost:5000/friends/accept`, {
        user1Username,
        user2Username: localStorage.getItem('user'),
      });
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };
  const declineFriendRequest = async (user1Username) => {
    try {
      const response = await axios.post(`http://localhost:5000/friends/decline`, {
        user1Username,
        user2Username: localStorage.getItem('user'),
      });
    }
    catch (error) {
      console.error('Error declining friend:', error);
    }
  };

    return (
    <div className="suggested-users">
      <h2>Friend Request</h2>
      
      <ul>
        {users.map(user => (
          <li key={user.username}>
          {images[user.username] && <img
            className="user-avatar"
            src={images[user.username]}
            alt={user.name}
          />}
          <div>
            <h3>{user.name}</h3>
            <p>@{user.username}</p>
          </div>
          <button className="friend_request_add_button" onClick={() => handleAddUser(user.username)}>✓</button>
          <button className='friend_request_decline_button' onClick={() =>declineFriendRequest(user.username)}>X</button> 
        </li>
      ))}
      </ul>
    </div>
    );  
}
export default RequestFriends;