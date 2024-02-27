import React, { useState, useEffect } from 'react';
import ProfileInfo from './ProfileInfo';
import Reviews from './Reviews';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Profile() {

  const [profileInfo, setProfileInfo] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [reviewTotal, setReviewTotal] = useState(0);
  const user = useParams();

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        var username = localStorage.getItem('user');
        if(user.id !== undefined){
          username = user.id;
        }
        const response = await axios.get('http://localhost:5000/profile', {
          headers: {
            username: username
          }
        });
        setProfileInfo(response.data.user);
        setReviews(response.data.reviews);
        setReviewTotal(response.data.reviews.length);
      } catch (error) {
        console.error('Error retrieving profile data:', error);
      }
    };
    fetchProfileInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  return (
    <div>
      <ProfileInfo reviewsID="reviews" profile={profileInfo} reviewTotal={reviewTotal} />
      <Reviews reviews={reviews}/>
    </div>
  );
}

export default Profile;
