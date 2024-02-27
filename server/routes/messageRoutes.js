const express = require('express');
const { sendMessage, getMessageHistory } = require('../controllers/messagesController');
const router = express.Router();

// Route to send a new message
router.post('/messages/send', sendMessage);

// Route to get message history between two users
router.get('/messages/history/:user1Username/:user2Username', getMessageHistory);


module.exports = router;
