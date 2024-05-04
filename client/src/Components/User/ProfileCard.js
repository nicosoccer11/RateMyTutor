import React, { useState, useEffect } from 'react';
import './ProfileCard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Avatar } from '@chakra-ui/react'; // Assuming you're using Chakra UI for the Avatar component

const ProfileCard = ({ name, username, email, avatar }) => {
    // State to hold the user's avatar image URL
    const [image, setImage] = useState("");

    // Effect hook to fetch the user's avatar image when the component mounts
    useEffect(() => {
        // Function to fetch the user's avatar image from the server
        const fetchPicture = async (user) => {
            // Make a GET request to the server to fetch the image
            await axios.get(`http://localhost:5000/image/get/${user}`).then((response) => {
                // Update the image state with the received image URL
                setImage(response.data.imageUrl);
            })
        }

        // Call the fetchPicture function to fetch the avatar image
        fetchPicture(username);
    }, [])

    return (
        <div className="profile-card">
            {/* Link to the user's profile page */}
            <Link to="/profile"> 
                {/* Avatar component to display the user's avatar image */}
                <Avatar src={image} name="user" size="md" />
            </Link>
            {/* Container for user information */}
            <div className="profile-card-info">
                {/* User's name */}
                <h2>{name}</h2>
                {/* User's username */}
                <p>@{username}</p>
            </div>
        </div>
    );
};

export default ProfileCard;
