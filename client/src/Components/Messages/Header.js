import React from "react";
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";

const Header = ({username}) => {
  return (
	<Flex w="100%">
  	<Avatar name="username" size="md" src="https://bit.ly/dan-abramov">
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