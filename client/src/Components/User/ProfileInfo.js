import React, { useEffect, useState } from 'react';
import './ProfileInfo.css';
import Test from './Test.jpg';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { FaEdit, FaTrash, FaSave } from 'react-icons/fa';

function ProfileInfo({ reviewsID, profile, reviewTotal, update, updateValue }) {

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
  const [editingLongDescription, setEditingLongDescription] = useState(false);
  const [editingShortDescription, setEditingShortDescription] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const sessionUsername = localStorage.getItem('user');

  useEffect(() => {
    async function fetchData() {
      if (profile) {
        setUsername(profile.username);
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setAverageRating(profile.averageRating);
        setShortDescription(profile.shortDescription);
        setLongDescription(profile.longDescription);
        setEducation(profile.education);
        setQualifications(profile.qualifications);
        if (profile.username) {
          try {
            const response = await axios.get(`http://localhost:5000/image/get/${profile.username}`, {
            });
            setProfilePicture(response.data.imageUrl);
          } catch (error) {
            console.error('Error retrieving profile data:', error);
          }
        }

      }
    }


    fetchData();
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
        update(!updateValue);
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
      update(!updateValue);
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
      update(!updateValue);
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
        update(!updateValue);
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
      update(!updateValue);
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
      update(!updateValue);
    } catch (error) {
      console.error('Error removing education', error);
    }
  }

  const handleEditLongDescription = () => {
    setEditingLongDescription(true);
  };

  const handleSaveLongDescription = async () => {
    try {
      await axios.patch(`http://localhost:5000/users/update/${username}`, {
        LongDescription: longDescription
      });
      setEditingLongDescription(false);
    } catch (error) {
      console.error('Error saving long description', error);
    }
  };

  const handleEditShortDescription = () => {
    setEditingShortDescription(true);
  };

  const handleSaveShortDescription = async () => {
    try {
      await axios.patch(`http://localhost:5000/users/update/${username}`, {
        ShortDescription: shortDescription
      });
      setEditingShortDescription(false);
    } catch (error) {
      console.error('Error saving short description', error);
    }
  };

  const [file, setFile] = useState(null);

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    //handleSubmit();
  };

  const handleImageClick = () => {
    document.getElementById('fileInput').click();
  };


  useEffect(() => {
    async function uploadPicture() {
      if (!file) {
        //console.error('No file selected');
        return;
      }
      try {
        const formData = new FormData();
        formData.append('image', file);

        await axios.post(`http://localhost:5000/image/post/${username}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        try {
          const response = await axios.get(`http://localhost:5000/image/get/${username}`, {
          });
          setProfilePicture(response.data.imageUrl);
        } catch (error) {
          console.error('Error retrieving profile data:', error);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    uploadPicture();
  }, [file]);


  return (
    <div className="profile-info-container">
      <div className="left-box">
        <div className="center" onClick={handleImageClick}>
          <img src={profilePicture} alt="Profile" className="profile-image" />
          {username === localStorage.getItem("user") &&
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />}
        </div>
        <div className="section">
          <h2 className="center">{username}</h2>
        </div>
        <div className="section">
          <h2>Short Description</h2>
          {editingShortDescription ? (
            <>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={1}
                cols={50}
              />
              <button onClick={handleSaveShortDescription}><FaSave /></button>
            </>
          ) : (
            <>
              <p>{shortDescription}</p>
              {username == sessionUsername && <button onClick={handleEditShortDescription}><FaEdit /></button>}
            </>
          )}
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
          {editingLongDescription ? (
            <>
              <textarea
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                rows={4}
                cols={50}
              />
              <button onClick={handleSaveLongDescription}><FaSave /></button>
            </>
          ) : (
            <>
              <p>{longDescription}</p>
              {username == sessionUsername && <button onClick={handleEditLongDescription}><FaEdit /></button>}
            </>
          )}
        </div>
        <div className="section">
          <div className="section-header">
            <h2>Education {username == sessionUsername && <button className="add-icon" onClick={() => { setShowAddEducation(true); setEditingEducation(false) }}>
              <FaPlus />
            </button>}</h2>
          </div>
          {education.length && education.map((line) =>
            <li key={line.educationid}>{line.degree} {line.school}
              {username === sessionUsername &&
                <div className="icons"><button onClick={() => handleEditEducation(line.school, line.degree, line.educationid)}>
                  <FaEdit />
                </button>
                  <button onClick={() => handleDeleteEducation(line.educationid, line.school, line.degree)}>
                    <FaTrash />
                  </button></div>}
            </li>
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
              {username == sessionUsername && <div className="icons"><button onClick={() => handleEditQualification(line.skill, line.qualificationid)}>
                <FaEdit />
              </button>
                <button onClick={() => handleDeleteQualification(line.qualificationid, line.skill)}>
                  <FaTrash />
                </button></div>}</li>
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
