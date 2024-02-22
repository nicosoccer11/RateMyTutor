import "./home.css"; 
import image from './user.jpeg';

const Post = ({user, content}) => {
    return (
        <div className="post">
            <div className='username'>
                <img src={image} alt="user" className="user-image" />
                {user}
            </div> 
            <p>{content}</p>
            
            <div className="post-actions">
                <button className='post_button'>Like</button>
                <button className='post_button'>Comment</button>
            </div>

        </div>
    );
}

const Home = () => {
    return (
        <div>
            <Post user = "Bob" user_image = './user.jpeg' content="Calling all upcoming and recent graduates excited about software engineering opportunities. DoorDash is excited to announce that we are hiring New Graduate and Entry-Level Software Engineers!
Learn more, apply directly using the links below, and kickstart your career at DoorDash. Please read role requirements carefully to ensure you are applying to the most aligned role for your skills and graduation date.
" /> 
            <Post content="Second post here!" />
            {/* Add more posts here */}
        </div>
    );
}

export default Home;<></>