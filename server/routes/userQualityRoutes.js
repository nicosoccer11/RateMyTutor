const express = require('express');
const router = express.Router();
const { addUserQuality, removeUserQuality, getUserQualities } = require('../controllers/userQualitiesController');

// Route to link a user to a quality
router.post('/user-qualities/add', addUserQuality);

// Route to remove a link between a user and a quality
router.delete('/user-qualities/remove', removeUserQuality);

// Route to get all qualities for a user
router.get('/user-qualities/:username', getUserQualities);

module.exports = router;
