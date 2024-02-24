import React, { useState, useEffect } from 'react';
import ProfileInfo from './ProfileInfo';
import Reviews from './Reviews';
import axios from 'axios';

function Profile() {

  const [profileInfo, setProfileInfo] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [reviewTotal, setReviewTotal] = useState(0);
  const username = localStorage.getItem('user');

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        console.log(username);
        const response = await axios.get('http://localhost:5000/profile', {
          headers: {
            Username: username
          }
        });
        console.log(response.data)
        setProfileInfo(response.data.user);
        setReviews(response.data.reviews);
        setReviewTotal(response.data.reviews.length);
      } catch (error) {
        console.error('Error retrieving profile data:', error);
      }
    };
    console.log("here");
    fetchProfileInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div>
      <ProfileInfo reviewsID="reviews" profile={profileInfo} reviewTotal={reviewTotal} />
      <Reviews reviews={reviews}/>
    </div>
  );
}

export default Profile;
