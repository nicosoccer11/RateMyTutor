import React from 'react';
import './ProfileCard.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar } from '@chakra-ui/react';

const ProfileCard = ({ name, username, email, avatar }) => {
    const [image, setImage] = useState("");

    useEffect(() => {
        const fetchPicture = async (user) => {
        await axios.get(`http://localhost:5000/image/get/${user}`).then((response) => {
            setImage(response.data.imageUrl);
        })
        }

        fetchPicture(username);
    }, [])

    return (
        <div className="profile-card">
        <Link to="/profile"> 
            <Avatar src={image} name="user" size="md" />
        </Link>
        <div className="profile-info">
            <h2>{name}</h2>
            <p>@{username}</p>
        </div>
        </div>
    );
};

export default ProfileCard;
