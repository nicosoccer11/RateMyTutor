import React, { useEffect, useRef, useState } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import axios from "axios";

const Messages = ({ messages, user1, user2 }) => {

	const [image, setImage] = useState("")
	useEffect(() => {
		const fetchPicture = async (user) => {
			await axios.get(`http://localhost:5000/image/get/${user}`).then((response) => {
				setImage(response.data.imageUrl);
			})
			}
		
		fetchPicture(user1);
	})

  const AlwaysScrollToBottom = () => {
	const elementRef = useRef();
	useEffect(() => elementRef.current.scrollIntoView());
	return <div ref={elementRef} />;
  };

  return (
	<Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
  	{messages.map((item, index) => {
    	if (item.from === user1) {
      	return (
        	<Flex key={index} w="100%" justify="flex-end">
          	<Flex
            	bg="black"
            	color="white"
            	minW="100px"
            	maxW="350px"
            	my="1"
            	p="3"
          	>
            	<Text>{item.text}</Text>
          	</Flex>
			<Avatar
			name="Computer"
			src={image}
			bg="blue.300">
			</Avatar>
        	</Flex>
      	);
    	} else {
      	return (
        	<Flex key={index} w="100%">
          	<Flex
            	bg="gray.100"
            	color="black"
            	minW="100px"
            	maxW="350px"
            	my="1"
            	p="3"
          	>
            	<Text>{item.text}</Text>
          	</Flex>
        	</Flex>
      	);
    	}
  	})}
  	<AlwaysScrollToBottom />
	</Flex>
  );
};

export default Messages;