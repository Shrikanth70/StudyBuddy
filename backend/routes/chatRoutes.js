const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const { generateAIResponse } = require('../config/aiConfig');

// Get chat history for a user
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50, offset = 0 } = req.query;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid userId format:', userId);
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid user ID format' 
            });
        }

        console.log('Fetching chat history for userId:', userId);

        const messages = await ChatMessage.find({ userId })
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(offset))
            .populate('userId', 'name profileImage');

        console.log(`Found ${messages.length} messages for userId: ${userId}`);

        res.json({
            success: true,
            messages: messages.reverse(),
            total: await ChatMessage.countDocuments({ userId })
        });
    } catch (error) {
        console.error('Error fetching chat history for userId:', req.params.userId, 'Error:', error.message, 'Stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch chat history',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Send a message and get AI response with RAG
router.post('/send', async (req, res) => {
    try {
        const { userId, message, messageType = 'text', metadata = {} } = req.body;

        if (!userId || !message) {
            return res.status(400).json({
                success: false,
                error: 'User ID and message are required'
            });
        }

        // Save user message
        const userMessage = new ChatMessage({
            userId,
            sender: 'user',
            message,
            messageType,
            metadata
        });
        await userMessage.save();

        // Perform retrieval for RAG
        let retrievedContext = [];
        try {
            const { generateQueryEmbedding } = require('../utils/embeddingUtils');
            const VectorStore = require('../utils/vectorStore');

            const queryEmbedding = await generateQueryEmbedding(message);
            retrievedContext = await VectorStore.searchSimilar(userId, queryEmbedding, 3); // Top 3 chunks
        } catch (retrievalError) {
            console.warn('Retrieval failed, proceeding without context:', retrievalError.message);
        }

        // Generate AI response with retrieved context
        const aiResponse = await generateAIResponse(message, [], {}, retrievedContext);

        // Save AI response with retrieval metadata
        const aiMessage = new ChatMessage({
            userId,
            sender: 'ai',
            message: aiResponse.message,
            aiResponse: aiResponse.metadata,
            retrievedContext: aiResponse.metadata.retrievedContext || []
        });
        await aiMessage.save();

        // Update user's study stats
        await updateUserStats(userId);

        res.json({
            success: true,
            userMessage,
            aiMessage,
            aiResponse: aiResponse.metadata
        });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

// Get AI response for a message (without saving)
router.post('/ai-response', async (req, res) => {
    try {
        const { message, context = [] } = req.body;

        if (!message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Message is required' 
            });
        }

        const aiResponse = await generateAIResponse(message, context);

        res.json({
            success: true,
            response: aiResponse.message,
            metadata: aiResponse.metadata
        });

    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({ success: false, error: 'Failed to generate AI response' });
    }
});

// Delete chat history for a user
router.delete('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        await ChatMessage.deleteMany({ userId });
        
        res.json({ 
            success: true, 
            message: 'Chat history deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting chat history:', error);
        res.status(500).json({ success: false, error: 'Failed to delete chat history' });
    }
});

// Get chat analytics for a user
router.get('/analytics/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { days = 30 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const analytics = await ChatMessage.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId), timestamp: { $gte: startDate } } },
            { $group: {
                _id: { 
                    $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                },
                messageCount: { $sum: 1 },
                userMessages: { $sum: { $cond: [{ $eq: ["$sender", "user"] }, 1, 0] } },
                aiMessages: { $sum: { $cond: [{ $eq: ["$sender", "ai"] }, 1, 0] } }
            }},
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            analytics,
            totalMessages: analytics.reduce((sum, day) => sum + day.messageCount, 0)
        });

    } catch (error) {
        console.error('Error fetching chat analytics:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
    }
});

// Helper function to update user study stats
async function updateUserStats(userId) {
    try {
        const user = await User.findById(userId);
        if (user) {
            // Increment study time (simulate 5 minutes per message)
            user.studyStats.totalStudyTime += 5;
            user.studyStats.completedTopics += 1;
            
            // Update accuracy based on AI response confidence
            user.studyStats.accuracy = Math.min(100, user.studyStats.accuracy + 2);
            
            await user.save();
        }
    } catch (error) {
        console.error('Error updating user stats:', error);
    }
}

module.exports = router;
