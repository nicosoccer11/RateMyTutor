import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import image from './user.jpeg';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Comment = ({ commentid, postid, content, time,user }) => {
    const [image, setImage] = useState("");


    useEffect(() => {
        const fetchPicture = async (user) => {
            await axios.get(`http://localhost:5000/image/get/${user}`).then((response) => {
                setImage(response.data.imageUrl);
            })
            }
        
        fetchPicture(user)
    
    }, [])

    return (
        <div className="commentbox">
            <img src={image} alt="user" className="user-image" />
            <div className="comment">
                <Link to={`/profile/${user}`} className='comment_username'>{user}</Link>
                <p>{content}</p>
            </div>
        </div>
    );
}
export default Comment;