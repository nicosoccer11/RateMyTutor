
// const Post = ({ user, content }) => {
    

//     useEffect(() => {
//         const fetchPicture = async (user) => {
//         await axios.get(`http://localhost:5000/image/get/${user}`).then((response) => {
//             setImage(response.data.imageUrl);
//         })
//         }

//         fetchPicture(user);
//     }, [])

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import "./home.css";
import axios from 'axios';
import Comment from './comment';
import { Avatar } from '@chakra-ui/react';

const Post = ({ user, content,postid,num_likes}) => {
    const [update, setupdate] = useState(false);
    const [numLikes, setNumLikes] = useState(0);
    const [numComment, setcomment] = useState(0);
    const [allcomments, setAllComments] = useState([]);
    const [image,setImage] = useState("");
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchPicture = async (user) => {
        await axios.get(`http://localhost:5000/image/get/${user}`).then((response) => {
            setImage(response.data.imageUrl);
        })
        }

        fetchPicture(user);

        const fetchNumLikes = async (postId) => {
            try {
                const response = await axios.get(`http://localhost:5000/likes/${postId}`);
                setNumLikes(response.data.count);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };
        fetchNumLikes(postid);
    }, [postid,update]);

    
    useEffect(() => {
        const fetchNumCom = async (postId) => {
            try {
                const response = await axios.get(`http://localhost:5000/comments/count/${postId}`);
                setcomment(response.data.commentCount);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };
        fetchNumCom(postid);

        const fetchLiked = async (postId) => {
            try {
                const response = await axios.get(`http://localhost:5000/likes/${postId}/${localStorage.getItem('user')}`);
                setLiked(response.data.hasLiked);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        }
        fetchLiked(postid);

    }, [postid,update]);

    
    const submit = async (content) => {
        try {
            const newComment = await axios.post('http://localhost:5000/comments', {
                postId: postid,
                username: localStorage.getItem('user'),
                content: content
            });
            setupdate(!update);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    

    useEffect(() => {
        const fetchComments = async (postId) => {
            try {
                const response = await axios.get(`http://localhost:5000/comments/${postId}`);
                setAllComments(response.data);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };
        fetchComments(postid);
    }, [update,postid]);

    function toggleCommentsBox(event) {
        var post = event.target.closest(".post");
        var commentsBox = post.querySelector(".comments-box");
    
        if (commentsBox.style.display === "none" || commentsBox.style.display === "") {
            commentsBox.style.display = "block";
        } else {
            commentsBox.style.display = "none";
        }
    }
    
    
    function submitComment(event) {
        var post = event.target.closest(".post");
        var input = post.querySelector(".comment-input");
        var commentText = input.value.trim();
        if (commentText !== "") {
            submit(commentText);
            input.value = "";

        } else {
            alert("Please enter a comment.");
        }
    }

    const [showAllComments, setShowAllComments] = useState(false);
    function get_all_comment(event) {
        setShowAllComments(!showAllComments);
    }

    function adjustTextareaHeight(el) {
        el.style.height = "auto";
        el.style.height = (el.scrollHeight) + "px";
    }

    function handleLike() {
        if (liked) {
            axios.delete(`http://localhost:5000/likes`, {
                data: {
                    postId: postid, 
                    username: localStorage.getItem('user')
                }
            });
            setLiked(false);
            setNumLikes(numLikes - 1);
        } else {
            axios.post('http://localhost:5000/likes', {
                postId: postid,
                username: localStorage.getItem('user')
            });
            setLiked(true);
            setNumLikes(numLikes + 1);
        }
    }

    return (
        <div className="post">
            <div className='username'>
                <Link className="post-photo" to={`/profile/${user}`}>
                    <Avatar src={image} name="user" size="md" />
                </Link>
                <h4>{user}</h4>
            </div>
            <p>{content}</p>
            <div className='info'>
                <p>{numLikes} Likes</p>
                <button className= "numcomments" onClick={get_all_comment}>{numComment} Comments</button>
            </div>
            <div className="post-actions">
                <button className= {`like_button ${liked === true ? 'selected': ''}`} onClick={handleLike}>Like</button>
                <button className='post_button' onClick={toggleCommentsBox}> Comment</button>
            </div>
            <div className="comments-box">
                <div className="comment-input-container">
                    <input type="text" placeholder="Add a comment..." className="comment-input" />
                    <button className="comment-submit" onClick={submitComment}>Post</button>
                </div>
            </div>
            <div className="comments">
                {allcomments.length !== 0 && showAllComments && allcomments.map((comment, index) => (
                    <Comment key={comment.commentid} commentid={comment.commentid} postid={postid} content={comment.content} time={comment.time} user = {comment.userid}/>
                ))}
            </div>
        </div>
    );
}


export default Post;