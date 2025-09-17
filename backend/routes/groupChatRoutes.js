const express = require('express');
const router = express.Router();
const GroupMessage = require('../models/GroupMessage');
const StudyGroup = require('../models/StudyGroup');
const { protect } = require('../middleware/auth');

// Get group messages with pagination
router.get('/:groupId/messages', protect, async (req, res) => {
    try {
        const { groupId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        // Check if user is a member of the group
        const group = await StudyGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, error: 'Study group not found' });
        }

        const isMember = group.members.some(member => 
            member.user.toString() === req.user.id
        );
        
        if (!isMember) {
            return res.status(403).json({ success: false, error: 'Not a member of this group' });
        }

        const messages = await GroupMessage.find({ 
            groupId, 
            isDeleted: false 
        })
            .populate('sender', 'name profileImage')
            .populate('replyTo')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await GroupMessage.countDocuments({ groupId, isDeleted: false });

        res.json({
            success: true,
            messages: messages.reverse(),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching group messages:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
});

// Send group message
router.post('/:groupId/messages', protect, async (req, res) => {
    try {
        const { groupId } = req.params;
        const { message, messageType = 'text', fileUrl, fileName, fileSize } = req.body;

        // Check if user is a member of the group
        const group = await StudyGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, error: 'Study group not found' });
        }

        const isMember = group.members.some(member => 
            member.user.toString() === req.user.id
        );
        
        if (!isMember) {
            return res.status(403).json({ success: false, error: 'Not a member of this group' });
        }

        const newMessage = new GroupMessage({
            groupId,
            sender: req.user.id,
            message,
            messageType,
            fileUrl,
            fileName,
            fileSize
        });

        await newMessage.save();
        
        // Update group stats
        await StudyGroup.findByIdAndUpdate(groupId, {
            $inc: { 'stats.totalMessages': 1 },
            'stats.lastActivity': new Date()
        });

        const populatedMessage = await GroupMessage.findById(newMessage._id)
            .populate('sender', 'name profileImage');

        res.status(201).json({ success: true, message: populatedMessage });
    } catch (error) {
        console.error('Error sending group message:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

// Edit group message
router.put('/:groupId/messages/:messageId', protect, async (req, res) => {
    try {
        const { groupId, messageId } = req.params;
        const { message } = req.body;

        const groupMessage = await GroupMessage.findOne({
            _id: messageId,
            groupId,
            sender: req.user.id
        });

        if (!groupMessage) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }

        groupMessage.message = message;
        groupMessage.isEdited = true;
        groupMessage.editedAt = new Date();

        await groupMessage.save();

        const populatedMessage = await GroupMessage.findById(groupMessage._id)
            .populate('sender', 'name profileImage');

        res.json({ success: true, message: populatedMessage });
    } catch (error) {
        console.error('Error editing group message:', error);
        res.status(500).json({ success: false, error: 'Failed to edit message' });
    }
});

// Delete group message (soft delete)
router.delete('/:groupId/messages/:messageId', protect, async (req, res) => {
    try {
        const { groupId, messageId } = req.params;

        const groupMessage = await GroupMessage.findOne({
            _id: messageId,
            groupId
        });

        if (!groupMessage) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }

        // Check if user is the sender or group admin
        const group = await StudyGroup.findById(groupId);
        const isSender = groupMessage.sender.toString() === req.user.id;
        const isAdmin = group.members.some(member => 
            member.user.toString() === req.user.id && member.role === 'admin'
        );

        if (!isSender && !isAdmin) {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this message' });
        }

        groupMessage.isDeleted = true;
        await groupMessage.save();

        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting group message:', error);
        res.status(500).json({ success: false, error: 'Failed to delete message' });
    }
});

// Add reaction to message
router.post('/:groupId/messages/:messageId/reactions', protect, async (req, res) => {
    try {
        const { groupId, messageId } = req.params;
        const { emoji } = req.body;

        const group = await StudyGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, error: 'Study group not found' });
        }

        const isMember = group.members.some(member => 
            member.user.toString() === req.user.id
        );
        
        if (!isMember) {
            return res.status(403).json({ success: false, error: 'Not a member of this group' });
        }

        const message = await GroupMessage.findById(messageId);
        if (!message) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }

        // Check if reaction already exists
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
            // Check if user already reacted
            const userIndex = existingReaction.users.indexOf(req.user.id);
            if (userIndex > -1) {
                // Remove reaction
                existingReaction.users.splice(userIndex, 1);
                if (existingReaction.users.length === 0) {
                    message.reactions = message.reactions.filter(r => r.emoji !== emoji);
                }
            } else {
                // Add reaction
                existingReaction.users.push(req.user.id);
            }
        } else {
            // Create new reaction
            message.reactions.push({
                emoji,
                users: [req.user.id]
            });
        }

        await message.save();
        
        const populatedMessage = await GroupMessage.findById(message._id)
            .populate('sender', 'name profileImage')
            .populate('reactions.users', 'name profileImage');

        res.json({ success: true, message: populatedMessage });
    } catch (error) {
        console.error('Error adding reaction:', error);
        res.status(500).json({ success: false, error: 'Failed to add reaction' });
    }
});

// Get group info
router.get('/:groupId/info', protect, async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await StudyGroup.findById(groupId)
            .populate('createdBy', 'name profileImage')
            .populate('members.user', 'name profileImage email')
            .populate('resources.addedBy', 'name');

        if (!group) {
            return res.status(404).json({ success: false, error: 'Study group not found' });
        }

        const isMember = group.members.some(member => 
            member.user.toString() === req.user.id
        );
        
        if (!isMember) {
            return res.status(403).json({ success: false, error: 'Not a member of this group' });
        }

        res.json({ success: true, group });
    } catch (error) {
        console.error('Error fetching group info:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch group info' });
    }
});

module.exports = router;
