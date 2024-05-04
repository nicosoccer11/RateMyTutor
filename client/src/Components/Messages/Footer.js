// Import necessary modules from React and Chakra UI
import React from "react";
import { Flex, Input, Button } from "@chakra-ui/react";

// Define the Footer component
const Footer = ({ inputMessage, setInputMessage, handleSendMessage }) => {
  return (
    // Flex container for the footer
    <Flex w="100%" mt="5">
      {/* Input field for typing messages */}
      <Input
        placeholder="Type Something..."
        border="none"
        borderRadius="none"
        _focus={{
          border: "1px solid black",
        }}
        // Handle sending message on Enter key press
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      {/* Send button */}
      <Button
        bg="black"
        color="white"
        borderRadius="none"
        _hover={{
          bg: "white",
          color: "black",
          border: "1px solid black",
        }}
        // Disable button if input message is empty
        disabled={inputMessage.trim().length <= 0}
        // Handle sending message on button click
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </Flex>
  );
};

// Export the Footer component
export default Footer;
