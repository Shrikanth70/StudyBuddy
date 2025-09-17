const Channel = require('../models/Channel');
const User = require('../models/User');

// Create a new channel
exports.createChannel = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    
    // Check if channel name already exists
    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) {
      return res.status(400).json({ error: 'Channel name already exists' });
    }

    const channel = new Channel({
      name,
      description,
      createdBy: req.user.id,
      isPrivate,
      members: [req.user.id] // Add creator as first member
    });

    await channel.save();
    
    // Populate the createdBy field with user details
    await channel.populate('createdBy', 'name email avatar');
    
    res.status(201).json({ 
      message: 'Channel created successfully', 
      channel 
    });
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({ error: 'Failed to create channel' });
  }
};

// Get all channels (public only or user's private channels)
exports.getChannels = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const privacyFilter = {
      $or: [
        { isPrivate: false },
        { isPrivate: true, members: req.user.id }
      ]
    };

    const searchFilter = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const query = Object.keys(searchFilter).length > 0 ? { $and: [privacyFilter, searchFilter] } : privacyFilter;

    const channels = await Channel.find(query)
      .populate('createdBy', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Channel.countDocuments(query);

    res.json({
      channels,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
};

// Get a single channel by ID
exports.getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Check if user can access private channel
    if (channel.isPrivate && !channel.members.includes(req.user.id)) {
      return res.status(403).json({ error: 'Access denied to private channel' });
    }

    res.json({ channel });
  } catch (error) {
    console.error('Error fetching channel:', error);
    res.status(500).json({ error: 'Failed to fetch channel' });
  }
};

// Join a channel
exports.joinChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    if (channel.isPrivate) {
      return res.status(403).json({ error: 'Cannot join private channel' });
    }

    if (!channel.members.includes(req.user.id)) {
      channel.members.push(req.user.id);
      await channel.save();
    }

    await channel.populate('createdBy', 'name email avatar');
    await channel.populate('members', 'name email avatar');

    res.json({ message: 'Joined channel successfully', channel });
  } catch (error) {
    console.error('Error joining channel:', error);
    res.status(500).json({ error: 'Failed to join channel' });
  }
};

// Leave a channel
exports.leaveChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    if (channel.createdBy.toString() === req.user.id) {
      return res.status(400).json({ error: 'Channel creator cannot leave the channel' });
    }

    channel.members = channel.members.filter(
      memberId => memberId.toString() !== req.user.id
    );

    await channel.save();
    res.json({ message: 'Left channel successfully' });
  } catch (error) {
    console.error('Error leaving channel:', error);
    res.status(500).json({ error: 'Failed to leave channel' });
  }
};

// Delete a channel (only by creator)
exports.deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    if (channel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only channel creator can delete the channel' });
    }

    await Channel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Channel deleted successfully' });
  } catch (error) {
    console.error('Error deleting channel:', error);
    res.status(500).json({ error: 'Failed to delete channel' });
  }
};
