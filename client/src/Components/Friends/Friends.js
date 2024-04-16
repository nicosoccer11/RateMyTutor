import React, { useState,useEffect } from 'react';
import './friend.css'; // Import CSS file
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Profile from '../User/Profile';
import axios from 'axios';
import Chat from '../Messages/Chat';
import { Flex } from '@chakra-ui/react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import ProfileCard from '../User/ProfileCard';
import RequestFriends from './RequestFriends';

class Friends extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
                    otherUser: null,
                    friends: [],
                    username: localStorage.getItem('user'),
                    friend_urls: [],
                    friend_requests: [],
                 };
    this.setFriends = this.setFriends.bind(this);
    this.setURLs = this.setURLs.bind(this);
  }

  componentDidMount() {
    this.fetchData()
    // this.fetchURLs()
  };
  deleteFriend = async (friend) => {
    await axios.post('http://localhost:5000/friends/delete', {
      user1Username:this.state.username, 
      user2Username:friend,
    }).then((response) => {
      console.log(response.data);
      this.fetchData();
    });
    console.log('Deleted friend:', friend);
  }

  fetchURLs = async (friends) => {
    let URLs = []
    for (let f in friends) {
      await axios.get(`http://localhost:5000/image/get/${friends[f]}`).then((response) => {
        URLs.push(response.data.imageUrl);
      })
    }
    
    this.setState({
      friend_urls: URLs,
    });
    return URLs
  }

  fetchData = async () => {
    try {
      let username = this.state.username;
      await axios.post('http://localhost:5000/friends/get', {
        username,
      }).then((response) => {
        const data = response.data; // Assuming the data returned is an array of friends
        const first_friend = data.friends[0]
        this.fetchURLs(data.friends);
        this.setState({
          friends: data.friends,
          otherUser: first_friend,
        });
      });
      
    } catch (error) {
      // Handle error, such as setting an error state
      console.error('Error fetching data:', error);
    }
  }

  setFriends(friends) {
    this.setState({
      friends: friends,
    });
  }

  setURLs(urls) {
    this.setState({
      friend_urls: urls,
    });
  }

  handleSendMessage = (friend) => {
    this.setState({
      otherUser: friend,
    })
    
  };
  showmenu = (e) => {
    e.preventDefault();
    console.log('clicked')
  };
  handleDropdownToggle = (index) => {
    this.setState(prevState => ({
      dropdownIndex: prevState.dropdownIndex === index ? -1 : index,
    }));
  };

  render() { 
    return (
      <>
      <ProfileCard username={this.state.username} email={`${this.state.username}@mail.com`} name={this.state.username} avatar="/images/logo512.png"/>
      
      <div className="friend-list-container">
       
        <div className="friend-list-wrapper">
        <h3></h3>
          <ul className="friend-list">
            {this.state.friends.map((friend, ind) => (
              <li key={friend} onClick={() => this.handleSendMessage(friend)} className={`friend-item ${this.state.otherUser === friend ? 'selected' : ''}`}>
                <Link to={`/profile/${friend}`}>
                  <img
                    className="friend-avatar"
                    src={this.state.friend_urls[ind]}
                    alt={friend}
                  />
  
                </Link>
                
                <div className="friend-info">
                  <h3>
                    {friend}
                  </h3>
                </div>
                <button className='delete' onClick={() => this.deleteFriend(friend)}>X</button>
              </li>
            ))}
          </ul>
        </div>
        {(this.state.otherUser || this.state.friends.length === 1) && <Chat friend={this.state.otherUser ? this.state.otherUser : this.state.friends[0]}/>}
      </div>
        <Routes>
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/messages/:id" element={<Chat/>} />
        </Routes>
        {<RequestFriends username = {this.state.username} handler={this.setFriends} friends={this.state.friends} urls={this.state.friend_urls} urlHandler={this.setURLs}/>}
        </>
    );
  }
}


export default Friends;
