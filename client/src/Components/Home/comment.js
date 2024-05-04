import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Component for rendering individual comments
const Comment = ({ commentid, postid, content, time, user }) => {
    // State to store user image
    const [image, setImage] = useState("");

    // Fetching user image when component mounts
    useEffect(() => {
        // Function to fetch user image from server
        const fetchPicture = async (user) => {
            // Making GET request to fetch user image
            await axios.get(`http://localhost:5000/image/get/${user}`).then((response) => {
                // Setting the retrieved image URL to state
                setImage(response.data.imageUrl);
            });
        };
        
        // Calling fetchPicture function with user as parameter
        fetchPicture(user);
    }, []);

    return (
        // Comment box containing user image and comment content
        <div className="commentbox">
            <img src={image} alt="user" className="user-image" />
            <div className="comment">
                <Link to={`/profile/${user}`} className='comment_username'>{user}</Link>
                <p>{content}</p>
            </div>
        </div>
    );
};

export default Comment;
