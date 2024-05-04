import React, { useState, useEffect } from 'react';
import './SuggestedUsersList.css';
import axios from 'axios';

const SuggestedUsersList = ({ users }) => {
  // State to store user images
  const [images, setImages] = useState({});

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

  // Fetch images for users when users prop changes
  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      // Fetch image for each user
      for (let user of users) {
        const img = await fetchPicture(user.username);
        newImages[user.username] = img;
      }
      // Update images state
      setImages(newImages);
    };
    fetchImages();
  }, [users]);

  // Function to handle adding a friend
  const handleAddUser = async (user1Username) => {
    try {
      // Send POST request to add friend
      const response = await axios.post(`http://localhost:5000/friends/add`, {
        user1Username,
        user2Username: localStorage.getItem('user'),
      });
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <div className="suggested-users">
      <h2>Suggested Friends</h2>
      <ul>
        {/* Map through users and render user info */}
        {users.map(user => (
          <li key={user.username}>
            {/* Render user image if available */}
            {images[user.username] && <img
              className="user-avatar"
              src={images[user.username]}
              alt={user.name}
            />}
            <div>
              <h3>{user.name}</h3>
              <p>@{user.username}</p>
            </div>
            {/* Render Add Friend button */}
            <button className="suggested_add_button" onClick={() => handleAddUser(user.username)}>Add Friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedUsersList;
