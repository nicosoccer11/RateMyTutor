import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Friends/friend.css'
import ProfileCard from '../User/ProfileCard';
import { Link, Route, Routes } from 'react-router-dom';
import Profile from '../User/Profile';
import Spinner from 'react-bootstrap/Spinner';


function Tutor() {
    const username = localStorage.getItem('user');
    const [tutors, setTutors] = useState([]);
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        const matchStudent = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/findTutors/' + username, {
                });
                let matches = response.data.names
                setTutors(matches)
                await fetchURLs(matches);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };

        const fetchURLs = async (friends) => {
            let URLs = []
            for (let f in friends) {
              await axios.get(`http://localhost:5000/image/get/${friends[f]}`).then((response) => {
                URLs.push(response.data.imageUrl);
              })
            }
            setUrls(URLs)
        }

        matchStudent();
    }, [])
    return ( 
        <>
      <ProfileCard username={username} email={`${username}@mail.com`} name={username} avatar="/images/logo512.png"/>
      
      <div className="friend-list-container">
       
        <div className="friend-list-wrapper">
        <h3></h3>
          {tutors.length === 0 ? <h1>Loading...<Spinner animation="border" variant="dark"/></h1> : <ul className="friend-list">
            {tutors.map((tutor, ind) => (
              <li key={tutor} className={`friend-item-tutor`}>
                <Link to={`/profile/${tutor}`}>
                  <img
                    className="friend-avatar"
                    src={urls[ind]}
                    alt={tutor}
                  />
  
                </Link>
                
                <div className="friend-info">
                  <h3>
                    {tutor}
                  </h3>
                </div>
              </li>
            ))}
          </ul>}
        </div>
      </div>
        <Routes>
          <Route path="/profile/:id" element={<Profile />} />
          {/* <Route path="/messages/:id" element={<Chat/>} /> */}
        </Routes>
        </>
        );
}

export default Tutor;