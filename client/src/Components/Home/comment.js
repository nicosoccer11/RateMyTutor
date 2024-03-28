import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import image from './user.jpeg';


const Comment = ({ commentid, postid, content, time,user }) => {
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