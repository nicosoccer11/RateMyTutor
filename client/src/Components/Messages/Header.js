// Import necessary modules from React and Chakra UI
import React, { useEffect, useState } from "react";
import { Flex, Avatar, AvatarBadge, Text } from "@chakra-ui/react";
import axios from "axios";

// Define the Header component
const Header = ({username}) => {
  // State variable for storing the user's image
  const [image, setImage] = useState("");

  // Fetch user's profile picture when the component mounts
  useEffect(() => {
    const fetchPicture = async (user) => {
      try {
        // Fetch the user's profile picture from the server
        const response = await axios.get(`http://localhost:5000/image/get/${user}`);
        // Set the profile picture in the state
        setImage(response.data.imageUrl);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };
    fetchPicture(username);
  }, [username]); // Ensure useEffect runs only when the username changes

  // Render the Header component
  return (
    <Flex w="100%">
      {/* User's avatar with profile picture */}
      <Avatar name="username" size="md" src={image}>
        {/* Badge indicating online status */}
        <AvatarBadge boxSize="1.25em" bg="green.500" />
      </Avatar>
      {/* User information */}
      <Flex flexDirection="column" mx="5" >
        {/* Username */}
        <Text fontSize="lg" fontWeight="bold">
          {username}
        </Text>
        {/* Online status */}
        <Text color="green.500">Online</Text>
      </Flex>
    </Flex>
  );
};

// Export the Header component
export default Header;
