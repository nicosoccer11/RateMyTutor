const db = require('../config/db');

// Send a message
const sendMessage = async (req, res) => {
    const { senderUsername, receiverUsername, content } = req.body;
  
    // Validate input
    if (!content.trim()) {
      return res.status(400).send('Message content cannot be empty.');
    }
  
    try {
      const timestamp = new Date(); // Current timestamp
      const newMessage = await db.query(
        'INSERT INTO messages (User1ID, User2ID, Content, Time) VALUES ($1, $2, $3, $4) RETURNING *',
        [senderUsername, receiverUsername, content, timestamp]
      );
  
      res.json({
        message: 'Message sent successfully',
        data: newMessage.rows[0]
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

  // Get user's message history with another user
  const getMessageHistory = async (req, res) => {
    const { user1Username, user2Username } = req.params;
  
    try {
      const messages = await db.query(
        'SELECT * FROM messages WHERE (User1ID = $1 AND User2ID = $2) OR (User1ID = $2 AND User2ID = $1) ORDER BY Time ASC',
        [user1Username, user2Username]
      );
  
      res.json({
        message: `Retrieved message history between ${user1Username} and ${user2Username}`,
        data: messages.rows
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
  module.exports = {
    sendMessage,
    getMessageHistory
  };