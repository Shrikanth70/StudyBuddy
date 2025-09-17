const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: String,
        enum: ['user', 'ai'],
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    messageType: {
        type: String,
        enum: ['text', 'file', 'image', 'link'],
        default: 'text'
    },
    metadata: {
        fileName: String,
        fileSize: Number,
        fileType: String,
        url: String
    },
    aiResponse: {
        confidence: Number,
        suggestedTopics: [String],
        followUpQuestions: [String]
    }
});

// Index for efficient querying
chatMessageSchema.index({ userId: 1, timestamp: -1 });
chatMessageSchema.index({ sender: 1, timestamp: -1 });

// Virtual for formatted timestamp
chatMessageSchema.virtual('formattedTime').get(function() {
    return this.timestamp.toLocaleTimeString();
});

// Virtual for relative time
chatMessageSchema.virtual('relativeTime').get(function() {
    const now = new Date();
    const diffInMinutes = Math.floor((now - this.timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
});

// Ensure virtuals are serialized
chatMessageSchema.set('toJSON', { virtuals: true });
chatMessageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
