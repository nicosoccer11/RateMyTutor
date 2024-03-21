import { Flex } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";
import { useParams } from 'react-router-dom';
import axios from 'axios'

const Chat = (props) => {
	const [messages, setMessages] = useState([
		// { from: "computer", text: "Hi, My Name is HoneyChat" },
		// { from: "me", text: "Hey there" },
		// { from: "me", text: "Myself Ferin Patel" },
		// {
		// from: "computer",
		// text: "Nice to meet you. You can send me message and i'll reply you with same message.",
		// },
	]);
	const [inputMessage, setInputMessage] = useState("");
	let user = localStorage.getItem('user');
	console.log(props);
	const friendId = useParams();
	const friend = props ? props.friend : friendId.id;
	useEffect(() => {
		const getPrevMessages = async () =>{
			//console.log(`user->${user} friend->${friendId.id}`);
			//const receiver = friendID ? friendID : "computer";
			console.log("polling");
		
			await axios.get(`http://localhost:5000/messages/history/${user}/${friend}`).then((response) => {
				//console.log(response.data.data);
				let msgData = response.data.data;
				let previous_messages = [];
				for (let msg in msgData){
					//console.log(msgData[msg]);
					previous_messages.push({"from": msgData[msg].user1id,
											"text": msgData[msg].content
											});
				}
				console.log(previous_messages)
				setMessages(previous_messages)
			})
		}
		getPrevMessages();

		// let interval;
		// if (!interval) {
		// 	interval = setInterval(getPrevMessages, 3000);
		// }

		// return () => clearInterval(interval);
	}, [friend])
	
	const handleSendMessage = () => {
		if (!inputMessage.trim().length) {
		return;
		}
		const data = inputMessage;

		setMessages((old) => [...old, { from: user, text: data }]);
		setInputMessage("");

		setTimeout(() => {
		//setMessages((old) => [...old, { from: "computer", text: data }]);
		}, 1000);

		axios.post('http://localhost:5000/messages/send', {
			senderUsername: user,
			receiverUsername: friend,
			content: inputMessage
		}).then((response) => {
			console.log(response);
		}, (error) => {
			console.log(error);
		});
	};

	return (
		<Flex w="100%" h="100vh" justify="center" align="center">
		<Flex w="40%" h="90%" flexDir="column">
			<Header username={friend}/>
			<Messages messages={messages} user1={user} user2={friend}/>
			<Footer
			inputMessage={inputMessage}
			setInputMessage={setInputMessage}
			handleSendMessage={handleSendMessage}
			/>
		</Flex>
		</Flex>
	);
	};

export default Chat;