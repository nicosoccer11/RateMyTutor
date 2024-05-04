import React, { useState, useEffect } from 'react';
import ProfileInfo from './ProfileInfo';
import Reviews from './Reviews';
import './Profile.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Posts from './Posts';
import Qualities from './Qualities';

function Profile({ setIsLoggedIn }) {
  // State variables for profile information, reviews, posts, and qualities
  const [profileInfo, setProfileInfo] = useState(null);
  const [reviewsOriginal, setReviewsOriginal] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [posts, setPosts] = useState(null);
  const [tempQualities, setTempQualities] = useState(null);
  const [qualities, setQualities] = useState(null);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [userProfileID, setUserProfileID] = useState(null);
  const [update, setUpdate] = useState(false);
  const [hadSession, setHadSession] = useState(false);

  // Extracting user ID from the URL path using useParams hook
  const user = useParams();
  const loggedInUser = localStorage.getItem('user');

  // useEffect hook to fetch profile information and review status
  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        var username = localStorage.getItem('user');
        if (user.id !== undefined) {
          username = user.id;
        }
        // Fetch profile information from the server
        const response = await axios.get('http://localhost:5000/profile', {
          headers: {
            username: username
          }
        });

        // Set profile information, reviews, and other relevant data
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

    // Fetch review status (whether the logged-in user had a session with the profile user)
    const fetchReviewStatus = async () => {
      try {
        var username = localStorage.getItem('user');
        if (user.id !== undefined) {
          username = user.id;
        }
        const response = await axios.post('http://localhost:5000/schedule/flag', {
          student: localStorage.getItem('user'),
          tutor: username
        });
        setHadSession(response.data.hadMeeting);
      } catch (error) {
        console.error('Error retrieving profile data:', error);
      }
    };

    fetchProfileInfo();
    fetchReviewStatus();
  }, [user, update]); // Dependency array includes 'user' and 'update' to trigger effect on relevant changes

  // useEffect hook to fetch qualities and match with logged-in user's qualities
  useEffect(() => {
    const fetchQualities = async () => {
      if (tempQualities) {
        try {
          // Fetch qualities data from the server
          const response = await axios.get(`http://localhost:5000/user-qualities/${loggedInUser}`);
          // Match user's qualities with logged-in user's qualities
          for (var i = 0; i < tempQualities.length; i++) {
            tempQualities[i].hasmatch = response.data[i].hasquality && tempQualities[i].hasquality;
          }
          setQualities(tempQualities); // Set matched qualities
        } catch (error) {
          console.error('Error retrieving qualities data:', error);
        }
      }
    }

    fetchQualities();
  }, [tempQualities, loggedInUser]); // Dependency array includes 'tempQualities' and 'loggedInUser'

  // useEffect hook to calculate rating color for reviews
  useEffect(() => {
    // Function to calculate rating color based on score
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
      // Update reviews with calculated rating color
      const updatedReviews = reviewsOriginal.map(review => {
        var color = calculateRatingColor(review.score)
        review.ratingColor = color;
        return { ...review };
      });
      setReviews(updatedReviews);
    }
  }, [reviewsOriginal]); // Dependency array includes 'reviewsOriginal'

  // Render profile information, qualities, posts, and reviews
  return (
    <div className='profile'>
      <ProfileInfo reviewsID="reviews" profile={profileInfo} reviewTotal={reviewTotal} update={setUpdate} updateValue={update} setIsLoggedIn={setIsLoggedIn} />
      <Qualities qualities={qualities} setQualities={setQualities} user={userProfileID} />
      <Posts posts={posts} user={userProfileID} update={setUpdate} updateValue={update} />
      <Reviews reviews={reviews} user={userProfileID} hadSession={hadSession} update={setUpdate} updateValue={update} />
    </div>
  );
}

export default Profile;
