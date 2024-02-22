import React, { useState } from 'react';
import axios from 'axios';
import './ProfileInfo.css';
import Test from './Test.jpg';

function ProfileInfo({ reviewsID }) {
  const [file, setFile] = useState(null);

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleImageClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Send POST request to the server
      await axios.post('http://localhost:5000/api/posts', formData, {
    headers: {
    'Content-Type': 'multipart/form-data',
  },
});

      console.log('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="profile-info-container">
      <div className="left-box">
        <div className="center" onClick={handleImageClick}>
          <img src={Test} alt="Profile" className="profile-image" />
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
        </div>

        <div className="section">
          <h2 className="center">"User"</h2>
        </div>
        <div className="section">
          <h2>Short Description</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit
            amet est eu mauris convallis scelerisque.
          </p>
        </div>
        <div className="section">
          <p className="rating">
            4.5/5 <a href={`#${reviewsID}`}> (40 reviews)</a>
          </p>
        </div>
      </div>

      <div className="right-box">
        <div className="section">
          <h1>About "User"</h1>
        </div>
        <div className="section">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit
            amet est eu mauris convallis scelerisque. Aliquam tincidunt ex vel
            arcu eleifend, vel pulvinar nisi rutrum. Sed auctor leo ac sem
            porttitor, vel scelerisque velit dapibus. Sed auctor leo ac sem
            porttitor, vel scelerisque velit dapibus.
          </p>
        </div>
        <div className="section">
          <h2>Education</h2>
          <p>Bachelor's Degree in Computer Science, University of Example</p>
        </div>
        <div className="section">
          <h2>Skills</h2>
          <ul>
            <li>React</li>
            <li>JavaScript</li>
            <li>HTML</li>
            <li>CSS</li>
          </ul>
        </div>
        <div className="section">
          <h2>Qualifications</h2>
          <p>Certified Web Developer</p>
        </div>
        <div className="section">
          <h2>More</h2>
        </div>
        <div className="section">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
