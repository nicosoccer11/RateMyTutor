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
  const [userProfileID, setUserProfileID] = useState(null);
  const [update, setUpdate] = useState(false);

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
        setUserProfileID(response.data.user.username);
      } catch (error) {
        console.error('Error retrieving profile data:', error);
      }
    };
    fetchProfileInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, update]);


  return (
    <div>
      <ProfileInfo reviewsID="reviews" profile={profileInfo} reviewTotal={reviewTotal} update={setUpdate} updateValue={update} />
      <Reviews reviews={reviews} user={userProfileID} update={setUpdate} updateValue={update} />
    </div>
  );
}

export default Profile;
