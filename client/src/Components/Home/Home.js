import React, { useState, useEffect } from 'react';
import "./home.css";
import image from './user.jpeg';
import axios from 'axios';
import CreatePost from './CreatePost';


const Post = ({ user, content }) => {
    return (
        <div className="post">
            <div class='username'>
                <img src={image} alt="user" className="user-image"/>
                <span className="username-text">user</span>
            </div>
            <p className='post-content'>{content}</p>

            <div className="post-actions">
                <button className='post_button'>Like</button>
                <button className='post_button'>Comment</button>
            </div>

        </div>
    );
}

function Home() {

    const [posts, setPosts] = useState([]);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const username = localStorage.getItem('user');

    useEffect(() => {
        const fetchPostsInfo = async () => {
            try {
                const response = await axios.get('http://localhost:5000/posts/friends/' + username, {
                });
                setPosts(response.data.posts);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };
        fetchPostsInfo();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNewPost = async (content) => {
        try {
            await axios.post('http://localhost:5000/posts', {
                content: content,
                username: localStorage.getItem('user')
            });
            // const response = await axios.get('http://localhost:5000/posts');
            // setPosts(response.data.posts);
        } catch (error) {
            console.error('Error adding new post:', error);
        }
    };

    const handleAddPostClick = () => {
        setShowCreatePost(true);
    };

    return (
        <div>
            <div className='new-post-container'>
                <button className="add-post-button" onClick={handleAddPostClick}>
                    <img src='images/plus.png'></img>
                </button>
                <div className="textbox">New Post</div>
            </div>
            
            {showCreatePost ? <CreatePost onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} /> : <></>}
            {posts != [] && posts.map((post, index) => (

                <Post key={index} user={post.userid} content={post.content} />
            ))}
        </div>
    );
}

export default Home;