import React, { useState, useEffect } from 'react';
import "./home.css";
import image from './user.jpeg';
import axios from 'axios';
import CreatePost from './CreatePost';

const Post = ({ user, content }) => {
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

function Home() {

    const [posts, setPosts] = useState([]);
    const [showCreatePost, setShowCreatePost] = useState(false);

    useEffect(() => {
        const fetchPostsInfo = async () => {
            try {
                const response = await axios.get('http://localhost:5000/posts', {
                    headers: {
                        username: localStorage.getItem('user')
                    }
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
            const response = await axios.get('http://localhost:5000/posts');
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Error adding new post:', error);
        }
    };

    const handleAddPostClick = () => {
        setShowCreatePost(true);
    };

    return (
        <div>
            <button className="add-post-button" onClick={handleAddPostClick}>Add Post</button>
            {showCreatePost ? <CreatePost onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} /> : <></>}
            {posts.map((post, index) => (
                <Post key={index} user={post.user} post={post.content} />
            ))}
            <Post user="test" content="testing" /><Post user="test" content="testing" /><Post user="test" content="testing" /><Post user="test" content="testing" /><Post user="test" content="testing" /><Post user="test" content="testing" /><Post user="test" content="testing" /><Post user="test" content="testing" />
        </div>
    );
}

export default Home;