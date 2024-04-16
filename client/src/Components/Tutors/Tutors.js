import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Tutor() {
    const username = localStorage.getItem('user');
    const [tutors, setTutors] = useState([])

    useEffect(() => {
        const matchStudent = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/findTutors/' + username, {
                });
                let matches = response.data.names
                setTutors(matches)
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };

        matchStudent();
    }, [])
    return ( 
        <>
            <ul>{tutors.map((friend) => (
                <li>{friend}</li>
            ))}</ul>
        </> );
}

export default Tutor;