//import image from './user.jpeg';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar } from '@chakra-ui/react';

const Post = ({ user, content }) => {
    const [image,setImage] = useState("");

    useEffect(() => {
        const fetchPicture = async (user) => {
        await axios.get(`http://localhost:5000/image/get/${user}`).then((response) => {
            setImage(response.data.imageUrl);
        })
        }

        fetchPicture(user);
    }, [])

    return (
        <div className="post">
            <div className='username'>
                <Link className="post-photo" to={`/profile/${user}`}>
                    <Avatar src={image} name="user" size="md" />
                </Link>
                <h4>{user}</h4>
            </div>
            <p>{content}</p>

            <div className="post-actions">
                <button className='post_button'>Like</button>
                <button className='post_button'>Comment</button>
            </div>

        </div>
    );
}

export default Post;