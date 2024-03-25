import React, { useState,useEffect } from 'react';
import './friend.css'; // Import CSS file
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Profile from '../User/Profile';
import axios from 'axios';
import Chat from '../Messages/Chat';
import { Flex } from '@chakra-ui/react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import ProfileCard from '../User/ProfileCard';

class Friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                    otherUser: null,
                    friends: [],
                    username: localStorage.getItem('user'),
                 };
  }

  componentDidMount() {
    this.fetchData()
  };

  fetchData = async () => {
    try {
      let username = this.state.username;
      await axios.post('http://localhost:5000/friends/get', {
        username,
      }).then((response) => {
        console.log(response);
        const data = response.data; // Assuming the data returned is an array of friends
        const first_friend = data.friends[0]
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

  handleSendMessage = (friend) => {
    // Logic for sending a message to the friend with the given ID
    console.log(this.state.friends);
    console.log(`Sending message to ${friend}`);
    this.setState({
      otherUser: friend,
    })
    
  };

  render() { 
    return (
      <>
      <ProfileCard username={this.state.username} email={`${this.state.username}@mail.com`} name={this.state.username} avatar="/images/logo512.png"/>
      
      <div className="friend-list-container">
       
        <div className="friend-list-wrapper">
        <h3></h3>
          <ul className="friend-list">
            {this.state.friends.map((friend) => (
              <li key={friend} onClick={() => this.handleSendMessage(friend)} className={`friend-item ${this.state.otherUser === friend ? 'selected' : ''}`}>
                <img
                  className="friend-avatar"
                  src={`https://via.placeholder.com/50?text=${friend}`}
                  alt={friend}
                />
                <div className="friend-info">
                  <h3>
                    {/* <Link className='name' to={`/profile/${friend}`}>{friend}</Link> Use Link component */}
                    {friend}
                    {/* <button className="message" onClick={() => this.handleSendMessage(friend)}>
                      <Link to={`/messages/${friend}`}>Message</Link> {/* Use Link component }
                    </button> */}
                  </h3>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {this.state.otherUser && <Chat friend={this.state.otherUser}/>}
      </div>
        <Routes>
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/messages/:id" element={<Chat/>} />
        </Routes>
        </>
    );
  }
}
 
// export default Friends;
// const Friends = () => {
//   const [currentPage, setCurrentPage] = useState(null);
//   const [otherUser, setOtherUser] = useState(null);
  

//   // State to hold the list of friends
//   const [friends, setFriends] = useState([]);
//   const[username,setUsername]=useState(localStorage.getItem('user'));
  

  
// };

export default Friends;
