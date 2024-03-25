import React from 'react';
import './ProfileCard.css';
import { Link } from 'react-router-dom';

const ProfileCard = ({ name, username, email, avatar }) => {
  return (
    <div className="profile-card">
      <Link to="/profile"> 
        <img src={avatar} alt="Profile Avatar" className="avatar" />
      </Link>
      <div className="profile-info">
        <h2>{name}</h2>
        <p>@{username}</p>
        <p>{email}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
