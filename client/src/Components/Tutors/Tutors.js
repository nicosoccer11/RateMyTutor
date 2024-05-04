import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Friends/friend.css'
import ProfileCard from '../User/ProfileCard';
import { Link, Route, Routes } from 'react-router-dom';
import Profile from '../User/Profile';
import Spinner from 'react-bootstrap/Spinner';
import { Rating } from 'react-simple-star-rating';

function Tutor() {
    // Get the current user's username from local storage
    const username = localStorage.getItem('user');

    // State variables
    const [tutors, setTutors] = useState([]); // Array to store tutors
    const [urls, setUrls] = useState([]); // Array to store image URLs for tutors
    const [averageRating, setAverageRating] = useState([]); // Array to store average ratings for tutors

    useEffect(() => {
        // Function to fetch profile information for tutors
        const fetchProfileInfo = async (users) => {
          try {
            let rates = [];
            for (let user of users) {
              // Fetch profile data for each tutor
              const response = await axios.get('http://localhost:5000/profile', {
                headers: {
                  username: user
                }
              });
              // Store the average rating for each tutor
              rates.push(response.data.user.averageRating);
            }
            // Update the averageRating state variable
            setAverageRating(rates);
          } catch (error) {
            console.error('Error retrieving profile data:', error);
          }
        };

        // Function to fetch tutors for the current user
        const matchStudent = async () => {
            try {
                // Fetch tutors from the backend API
                const response = await axios.get('http://127.0.0.1:5000/findTutors/' + username);
                // Extract tutor names from the response
                let matches = response.data.names;
                // Update the tutors state variable
                setTutors(matches);
                // Fetch image URLs for each tutor
                await fetchURLs(matches);
                // Fetch profile information for each tutor
                await fetchProfileInfo(matches);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };

        // Function to fetch image URLs for tutors
        const fetchURLs = async (friends) => {
            let URLs = [];
            for (let f in friends) {
              // Fetch image URL for each tutor
              await axios.get(`http://localhost:5000/image/get/${friends[f]}`).then((response) => {
                // Store the image URL
                URLs.push(response.data.imageUrl);
              })
            }
            // Update the urls state variable
            setUrls(URLs);
        }

        // Call the matchStudent function to fetch tutor information
        matchStudent();
    }, []);

    // Render the component
    return ( 
        <>
            {/* Render the profile card for the current user */}
            <ProfileCard username={username} email={`${username}@mail.com`} name={username} avatar="/images/logo512.png"/>
            
            {/* Render the list of tutors */}
            <div className="friend-list-container">
                <div className="friend-list-wrapper">
                    {/* Display a loading spinner if tutors are being fetched */}
                    {tutors.length === 0 ? 
                        <h1>Loading Recommended Tutors...<Spinner animation="border" variant="dark"/></h1> : 
                        <ul className="friend-list">
                            {/* Map over each tutor and display their information */}
                            {tutors.map((tutor, ind) => (
                                <li key={tutor} className={`friend-item-tutor`}>
                                    {/* Link to the tutor's profile */}
                                    <Link to={`/profile/${tutor}`}>
                                        {/* Display the tutor's avatar */}
                                        <img
                                            className="friend-avatar"
                                            src={urls[ind]}
                                            alt={tutor}
                                        />
                                    </Link>
                                    {/* Display the tutor's information */}
                                    <div className="friend-info">
                                        <h3>
                                            {tutor}
                                        </h3>
                                        {/* Display the tutor's average rating */}
                                        <Rating className="rating-stars" initialValue={averageRating[ind] / 2} readonly={true} allowFraction={true} size={20}></Rating>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
            </div>
            {/* Define routes for profile */}
            <Routes>
                <Route path="/profile/:id" element={<Profile />} />
            </Routes>
        </>
    );
}

export default Tutor;
