import React from 'react';
import ProfileInfo from './ProfileInfo';
import Reviews from './Reviews';

function Profile() {
  return (
    <div>
      <ProfileInfo reviewsID="reviews" />
      <Reviews />
    </div>
  );
}

export default Profile;
