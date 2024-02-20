import React from 'react';
import './ProfileInfo.css';
import Test from './Test.jpg'

function ProfileInfo({reviewsID}) {
  return (
    <div className="profile-info-container">
      <div className="left-box">
        <div className='center'>
          <img src={Test} alt="Profile" className="profile-image" />
        </div>
        <div className="section">
          <h2 className="center">"User"</h2>
        </div>
        <div className="section">
          <h2>Short Description</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet est eu mauris convallis scelerisque.</p>
        </div>
        <div className="section">
          <p className="rating">4.5/5 <a href={`#${reviewsID}`}> (40 reviews)</a></p>
        </div>
      </div>

      <div className="right-box">
        <div className="section">
          <h1>About "User"</h1>
        </div>
        <div className="section">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet est eu mauris convallis scelerisque. Aliquam tincidunt ex vel arcu eleifend, vel pulvinar nisi rutrum. Sed auctor leo ac sem porttitor, vel scelerisque velit dapibus. Sed auctor leo ac sem porttitor, vel scelerisque velit dapibus.</p>
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
      </div>
    </div>
  );
}

export default ProfileInfo;
