import React from "react";
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";
import { useEffect, useState } from 'react'
import axios from "axios";

const Header = ({username}) => {
	const [image, setImage] = useState("");
	useEffect(() => {
		const fetchPicture = async (user) => {
			await axios.get(`http://localhost:5000/image/get/${user}`).then((response) => {
				setImage(response.data.imageUrl);
			})
			}
		
		fetchPicture(username);

	})

  return (
	<Flex w="100%">
  	<Avatar name="username" size="md" src={image}>
    	<AvatarBadge boxSize="1.25em" bg="green.500" />
  	</Avatar>
  	<Flex flexDirection="column" mx="5" >
    	<Text fontSize="lg" fontWeight="bold">
      	{username}
    	</Text>
    	<Text color="green.500">Online</Text>
  	</Flex>
	</Flex>
  );
};

export default Header;