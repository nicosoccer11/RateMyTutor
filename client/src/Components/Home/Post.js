import image from './user.jpeg';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

const Post = ({ user, content }) => {
    return (
        <div className="post">
            <div className='username'>
                <img src={image} alt="user" className="user-image" />
                <Link className='name' to={`/profile/${user}`}>{user}</Link>
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