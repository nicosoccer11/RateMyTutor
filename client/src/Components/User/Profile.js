import React, { useState, useEffect } from 'react';
import ProfileInfo from './ProfileInfo';
import Reviews from './Reviews';

import axios from 'axios';
import { useParams } from 'react-router-dom';
import Posts from './Posts';
import Qualities from './Qualities';
function Profile() {

  const [profileInfo, setProfileInfo] = useState(null);
  const [reviewsOriginal, setReviewsOriginal] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [posts, setPosts] = useState(null);
  const [tempQualities, setTempQualities] = useState(null);
  const [qualities, setQualities] = useState(null);
  const [reviewTotal, setReviewTotal] = useState(0);
  const user = useParams();
  const loggedInUser = localStorage.getItem('user');
  const [userProfileID, setUserProfileID] = useState(null);
  const [update, setUpdate] = useState(false);

  useEffect(() => {

    const fetchProfileInfo = async () => {
      try {
        var username = localStorage.getItem('user');
        if (user.id !== undefined) {
          username = user.id;
        }
        const response = await axios.get('http://localhost:5000/profile', {
          headers: {
            username: username
          }
        });

        setProfileInfo(response.data.user);
        setReviewsOriginal(response.data.reviews);
        setReviewTotal(response.data.reviews.length);
        setPosts(response.data.user.posts);
        setUserProfileID(response.data.user.username);
        setTempQualities(response.data.user.qualities);
      } catch (error) {
        console.error('Error retrieving profile data:', error);
      }
    };
    fetchProfileInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, update]);

  useEffect(() => {

    const fetchQualities = async () => {
      if(tempQualities){
        try {
          const response = await axios.get(`http://localhost:5000/user-qualities/${loggedInUser}`, {
          });
          for(var i = 0; i < tempQualities.length; i++){
            tempQualities[i].hasmatch = response.data[i].hasquality && tempQualities[i].hasquality;
          }
          setQualities(tempQualities);
        } catch (error) {
          console.error('Error retrieving qualities data:', error);
        }
      }
    }

    fetchQualities();
    
  }, [tempQualities])

  useEffect(() => {

    const calculateRatingColor = (score) => {
      if (score >= 7) {
        return 'green';
      } else if (score >= 4) {
        return 'orange';
      } else {
        return 'red';
      }
    };

    if (reviewsOriginal && reviewsOriginal.length > 0) {
      const updatedReviews = reviewsOriginal.map(review => {
        var color = calculateRatingColor(review.score)
        review.ratingColor = color;
        return {
          ...review
        };
      });
      setReviews(updatedReviews);
    }
  }, [reviewsOriginal])


  return (
    <div>
      <ProfileInfo reviewsID="reviews" profile={profileInfo} reviewTotal={reviewTotal} update={setUpdate} updateValue={update} />
      <Qualities qualities={qualities} setQualities={setQualities} user={userProfileID} />
      <Posts posts={posts} user={userProfileID} update={setUpdate} updateValue={update}/>
      <Reviews reviews={reviews} user={userProfileID} update={setUpdate} updateValue={update} />
    </div>
  );
}

export default Profile;
