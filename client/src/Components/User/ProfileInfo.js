import React, { useEffect, useState } from 'react';
import './ProfileInfo.css';
import Test from './Test.jpg';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';

function ProfileInfo({ reviewsID, profile, reviewTotal }) {

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [averageRating, setAverageRating] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [qualifications, setQualifications] = useState([]);
  const [education, setEducation] = useState([]);
  const [skill, setSkill] = useState('');
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('');
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddQualification, setShowAddQualification] = useState(false);
  const [showDeleteConfirmationE, setShowDeleteConfirmationE] = useState(false);
  const [schoolD, setSchoolD] = useState('');
  const [degreeD, setDegreeD] = useState('');
  const [eIDD, setEIDD] = useState('');
  const [showDeleteConfirmationQ, setShowDeleteConfirmationQ] = useState(false);
  const [skillD, setSkillD] = useState('');
  const [qIDD, setQIDD] = useState('');
  const [editingEducation, setEditingEducation] = useState(false);
  const [editingQualifications, setEditingQualifications] = useState(false);
  const sessionUsername = localStorage.getItem('user');

  useEffect(() => {
    if (profile) {
      console.log(profile);
      setUsername(profile.username);
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setAverageRating(profile.averageRating);
      setShortDescription(profile.shortDescription);
      setLongDescription(profile.longDescription);
      setEducation(profile.education);
      setQualifications(profile.qualifications);
    }
  }, [profile]);

  const addQualification = async () => {
    if (editingQualifications) {
      editQualification()
    }
    else {
      try {
        const response = await axios.post('http://localhost:5000/qualifications/add', {
          username,
          skill,
        });
        setShowAddQualification(false);
        setSkill('');
      } catch (error) {
        console.error('Error adding qualification', error);
      }
    }
  };

  const handleEditQualification = async (skill, id) => {
    setSkill(skill);
    setQIDD(id);
    setShowAddQualification(true);
    setEditingQualifications(true);
  }

  const editQualification = async () => {
    try {
      const response = await axios.patch(`http://localhost:5000/qualifications/edit/${qIDD}`, {
        skill
      });
      setShowAddQualification(false);
      setSkill('');
    } catch (error) {
      console.error('Error editing qualification', error);
    }
  };

  const handleDeleteQualification = (id, skill) => {
    setQIDD(id);
    setSkillD(skill);
    setShowDeleteConfirmationQ(true);
  };

  const deleteQualification = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/qualifications/delete/${qIDD}`, {
      });
      setShowDeleteConfirmationQ(false);
    } catch (error) {
      console.error('Error removing education', error);
    }
  }

  const addEducation = async () => {
    if (editingEducation) {
      editEducation();
    }
    else {
      try {
        const response = await axios.post('http://localhost:5000/education/add', {
          username,
          school,
          degree,
        });
        setShowAddEducation(false);
        setSchool('');
        setDegree('');
      } catch (error) {
        console.error('Error adding qualification', error);
      }
    }
  };

  const handleEditEducation = async (school, degree, id) => {
    setSchool(school);
    setDegree(degree);
    setEIDD(id);
    setShowAddEducation(true);
    setEditingEducation(true);
  }

  const editEducation = async () => {
    try {
      const response = await axios.patch(`http://localhost:5000/education/edit/${eIDD}`, {
        school,
        degree,
      });
      setShowAddEducation(false);
      setSchool('');
      setDegree('');
    } catch (error) {
      console.error('Error editing education', error);
    }
  };

  const handleDeleteEducation = (id, school, degree) => {
    setEIDD(id);
    setSchoolD(school);
    setDegreeD(degree);
    setShowDeleteConfirmationE(true);
  };

  const deleteEducation = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/education/delete/${eIDD}`, {
      });
      setShowDeleteConfirmationE(false);
    } catch (error) {
      console.error('Error removing education', error);
    }
  }

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
          <div className="section-header">
            <h2>Education {username == sessionUsername && <button className="add-icon" onClick={() => { setShowAddEducation(true); setEditingEducation(false) }}>
              <FaPlus />
            </button>}</h2>
          </div>
          {education.length && education.map((line) =>
            <li key={line.educationid}>{line.degree} {line.school}
              {username == sessionUsername && <><button onClick={() => handleEditEducation(line.school, line.degree, line.educationid)}>Edit</button>
                <button onClick={() => handleDeleteEducation(line.educationid, line.school, line.degree)}>Delete</button></>}</li>
          )}
          {showDeleteConfirmationE && (
            <div className="confirmation-popup">
              <p>Are you sure you want to delete this entry?</p>
              <p>{degreeD} {schoolD}</p>
              <button onClick={deleteEducation}>Yes</button>
              <button onClick={() => setShowDeleteConfirmationE(false)}>No</button>
            </div>
          )}

        </div>
        {showAddEducation && (
          <div className="popup">
            <label htmlFor="qualification">School:</label>
            <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} />
            <label htmlFor="qualification">Degree:</label>
            <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} />
            <button onClick={addEducation}>Save Education</button>
            <button onClick={() => { setShowAddEducation(false); setSchool(''); setDegree('') }}>Cancel</button>
          </div>
        )}
        <div className="section">
          <div className="section-header">
            <h2>Qualifications {username == sessionUsername && <button className="add-icon" onClick={() => { setShowAddQualification(true); setEditingQualifications(false) }}>
              <FaPlus />
            </button>}</h2>
          </div>
          {qualifications.length && qualifications.map((line) =>
            <li key={line.qualificationid}>{line.skill}
              {username == sessionUsername && <><button onClick={() => handleEditQualification(line.skill, line.qualificationid)}>Edit</button>
                <button onClick={() => handleDeleteQualification(line.qualificationid, line.skill)}>Delete</button></>}</li>
          )}
          {showDeleteConfirmationQ && (
            <div className="confirmation-popup">
              <p>Are you sure you want to delete this entry?</p>
              <p>{skillD}</p>
              <button onClick={deleteQualification}>Yes</button>
              <button onClick={() => setShowDeleteConfirmationQ(false)}>No</button>
            </div>
          )}
        </div>
        {showAddQualification && (
          <div className="popup">
            <label htmlFor="qualification">Qualification:</label>
            <input type="text" value={skill} onChange={(e) => setSkill(e.target.value)} />
            <button onClick={addQualification}>Save Qualification</button>
            <button onClick={() => { setShowAddQualification(false); setSkill('') }}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileInfo;
