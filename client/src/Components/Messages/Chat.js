// Import necessary modules from Chakra UI and React
import { Flex } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";
import { useParams } from 'react-router-dom';
import axios from 'axios'

// Define the Chat component
const Chat = (props) => {
	// State variables initialization
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState("");
	// Get the logged-in user from localStorage
	let user = localStorage.getItem('user');
	// Get the friend's id from the URL params
	const friendId = useParams();
	// Determine the friend based on props or URL params
	const friend = props ? props.friend : friendId.id;

	// Function to fetch previous messages between the user and the friend
	useEffect(() => {
		const getPrevMessages = async () => {
			try {
				// Fetch previous messages from the server
				const response = await axios.get(`http://localhost:5000/messages/history/${user}/${friend}`);
				// Process the response data to format messages
				let msgData = response.data.data;
				let previous_messages = [];
				for (let msg in msgData){
					previous_messages.push({
						"from": msgData[msg].user1id,
						"text": msgData[msg].content
					});
				}
				// Set the messages state with previous messages
				setMessages(previous_messages)
			} catch (error) {
				console.error('Error retrieving previous messages:', error);
			}
		}
		getPrevMessages();
	}, [friend])

	// Function to handle sending a new message
	const handleSendMessage = () => {
		if (!inputMessage.trim().length) {
			return;
		}
		// Create message data
		const data = inputMessage;
		// Update messages state with the new message
		setMessages((old) => [...old, { from: user, text: data }]);
		setInputMessage("");

		// Send the message to the server
		axios.post('http://localhost:5000/messages/send', {
			senderUsername: user,
			receiverUsername: friend,
			content: inputMessage
		}).then((response) => {
			// Handle success response if needed
		}).catch((error) => {
			console.error('Error sending message:', error);
		});
	};

	// Render the Chat component
	return (
		<Flex w="25%" h="100%" justify="left" align="center">
			<Flex w="1000%" h="90%" flexDir="column">
				{/* Header component */}
				<Header username={friend}/>
				{/* Messages component */}
				<Messages messages={messages} user1={user} user2={friend}/>
				{/* Footer component */}
				<Footer
					inputMessage={inputMessage}
					setInputMessage={setInputMessage}
					handleSendMessage={handleSendMessage}
				/>
			</Flex>
		</Flex>
	);
};

// Export the Chat component
export default Chat;
