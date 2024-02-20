import React from 'react';
import './ProfileInfo.css';

function ProfileInfo() {
  return (
    <div className="profile-info">
      <div className="profile-pic">
        {/* Profile picture */}
        <img src="profile-pic-url" alt="Profile" />
      </div>
      <div className="user-info">
        {/* Username */}
        <h2>Username</h2>
        {/* Short bio */}
        <p>Short bio</p>
        {/* Rating score */}
        <div className="rating">
          Rating: 4.5 {/* Example rating */}
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
