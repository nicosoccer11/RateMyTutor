// Import necessary modules from React and Chakra UI
import React, { useEffect, useRef, useState } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import axios from "axios";

// Define the Messages component
const Messages = ({ messages, user1, user2 }) => {
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
    fetchPicture(user1);
  }, [user1]); // Ensure useEffect runs only when the user1 changes

  // Component to always scroll to the bottom of the message container
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  // Render the Messages component
  return (
    <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
      {/* Map through messages and render each message */}
      {messages.map((item, index) => {
        if (item.from === user1) {
          // Render user1's message
          return (
            <Flex key={index} w="100%" justify="flex-end">
              {/* User1's message bubble */}
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
              {/* User1's avatar */}
              <Avatar
                name="Computer"
                src={image}
                bg="blue.300"
              />
            </Flex>
          );
        } else {
          // Render user2's message
          return (
            <Flex key={index} w="100%">
              {/* User2's message bubble */}
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
      {/* Component to ensure scrolling to bottom */}
      <AlwaysScrollToBottom />
    </Flex>
  );
};

// Export the Messages component
export default Messages;
