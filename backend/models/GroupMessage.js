const mongoose = require('mongoose');

const GroupMessageSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudyGroup',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 2000
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file', 'announcement', 'system'],
        default: 'text'
    },
    fileUrl: {
        type: String
    },
    fileName: {
        type: String
    },
    fileSize: {
        type: Number
    },
    reactions: [{
        emoji: String,
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    }],
    mentions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupMessage'
    }
}, {
    timestamps: true
});

// Indexes for better query performance
GroupMessageSchema.index({ groupId: 1, createdAt: -1 });
GroupMessageSchema.index({ sender: 1 });
GroupMessageSchema.index({ 'reactions.users': 1 });

module.exports = mongoose.model('GroupMessage', GroupMessageSchema);
