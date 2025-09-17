const express = require('express');
const router = express.Router();
const {
  createChannel,
  getChannels,
  getChannel,
  joinChannel,
  leaveChannel,
  deleteChannel
} = require('../controllers/channelController');

const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Create a new channel
router.post('/', createChannel);

// Get all channels (with pagination and search)
router.get('/', getChannels);

// Get a specific channel
router.get('/:id', getChannel);

// Join a channel
router.post('/:id/join', joinChannel);

// Leave a channel
router.post('/:id/leave', leaveChannel);

// Delete a channel
router.delete('/:id', deleteChannel);

module.exports = router;
