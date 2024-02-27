import React, { useEffect, useState } from 'react';
import './ProfileInfo.css';
import Test from './Test.jpg';

function ProfileInfo({ reviewsID, profile, reviewTotal }) {

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [averageRating, setAverageRating] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [qualifications, setQualifications] = useState([]);
  const [education, setEducation] = useState([]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setAverageRating(profile.averageRating);
      setShortDescription(profile.shortDescription);
      setLongDescription(profile.longDescription);
      setEducation(profile.education);
      setQualifications(profile.qualifications);
      console.log("average", profile.averageRating);
    }
  }, [profile]);

  return (
    <div className="profile-info-container">
      <div className="left-box">
        <div className='center'>
          <img src={Test} alt="Profile" className="profile-image" />
        </div>
        <div className="section">
          <h2 className="center">{username}</h2>
        </div>
        <div className="section">
          <h2>Short Description</h2>
          <p>{shortDescription}</p>
        </div>
        <div className="section">
          <p className="rating">{averageRating}/10 <a href={`#${reviewsID}`}> ({reviewTotal} review(s))</a></p>
        </div>
      </div>

      <div className="right-box">
        <div className="section">
          <h1>About {firstName} {lastName}</h1>
        </div>
        <div className="section">
          <p>{longDescription}</p>
        </div>
        <div className="section">
          <h2>Education</h2>
          {education.length && education.map((line) =>
            <li>{line.degree} {line.school}</li>
          )}
        </div>
        <div className="section">
          <h2>Qualifications</h2>
          {qualifications.length && qualifications.map((line) =>
            <li>{line.skill}</li>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
