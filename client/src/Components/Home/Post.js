import image from './user.jpeg';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import "./home.css";
import axios from 'axios';
import Comment from './comment';

const Post = ({ user, content,postid,num_likes}) => {
    const [update, setupdate] = useState(false);
    const [numLikes, setNumLikes] = useState(0);
    const [numComment, setcomment] = useState(0);
    const [allcomments, setAllComments] = useState([]);

    useEffect(() => {
        const fetchNumLikes = async (postId) => {
            try {
                const response = await axios.get(`http://localhost:5000/likes/${postId}`);
                setNumLikes(response.data.count);
                console.log("Number of Likes:", response.data.count);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };
        fetchNumLikes(postid);
    }, [postid]);

    
    useEffect(() => {
        const fetchNumCom = async (postId) => {
            try {
                const response = await axios.get(`http://localhost:5000/comments/count/${postId}`);
                console.log("Number of Comments:", response.data.commentCount);
                setcomment(response.data.commentCount);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };
        fetchNumCom(postid);
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
                console.log("Fetching comments for post:", postId);
                const response = await axios.get(`http://localhost:5000/comments/${postId}`);
                setAllComments(response.data);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };
    
        // Call fetchComments with the current postid
        fetchComments(postid);
    }, [update,postid]);

    function toggleCommentsBox(event) {
        console.log("comment button pressed")
        var post = event.target.closest(".post");
        var commentsBox = post.querySelector(".comments-box");
    
        if (commentsBox.style.display === "none") {
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
            // You can handle the comment submission here
            console.log("New comment:", commentText);
            // Clear the input after submitting
            input.value = "";

        } else {
            alert("Please enter a comment.");
        }
    }

    const [showAllComments, setShowAllComments] = useState(false);
    function get_all_comment(event) {
        console.log("number of comments button pressed");
        setShowAllComments(!showAllComments);
    }

    function adjustTextareaHeight(el) {
        el.style.height = "auto";
        el.style.height = (el.scrollHeight) + "px";
    }

    return (
        <div className="post">
            <div className='username'>
                <img src={image} alt="user" className="user-image" />
                <Link className='name' to={`/profile/${user}`}>{user}</Link>
            </div>
            <p>{content}</p>
            <div className='info'>
                <p>{numLikes} Likes</p>
                <button className= "numcomments" onClick={get_all_comment}>{numComment} Comments</button>
            </div>
            <div className="post-actions">
                <button className='post_button'>Like</button>
                <button className='post_button' onClick={toggleCommentsBox}> Comment</button>
            </div>
            <div className="comments-box">
                <div class="comment-input-container">
                    <input type="text" placeholder="Add a comment..." class="comment-input" />
                    <button class="comment-submit" onClick={submitComment}>Post</button>
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