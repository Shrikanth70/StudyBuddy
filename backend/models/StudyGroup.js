const mongoose = require('mongoose');

const StudyGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
        default: 'all-levels'
    },
    maxMembers: {
        type: Number,
        default: 50,
        min: 2,
        max: 100
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['admin', 'moderator', 'member'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    joinCode: {
        type: String,
        unique: true,
        sparse: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    rules: [{
        type: String,
        maxlength: 200
    }],
    resources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ['video', 'article', 'document', 'quiz', 'other']
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    stats: {
        totalMessages: {
            type: Number,
            default: 0
        },
        totalFiles: {
            type: Number,
            default: 0
        },
        lastActivity: {
            type: Date,
            default: Date.now
        }
    },
    settings: {
        allowFileSharing: {
            type: Boolean,
            default: true
        },
        allowVoiceChat: {
            type: Boolean,
            default: false
        },
        requireApproval: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
StudyGroupSchema.index({ name: 'text', description: 'text', subject: 'text' });
StudyGroupSchema.index({ tags: 1 });
StudyGroupSchema.index({ 'members.user': 1 });
StudyGroupSchema.index({ createdBy: 1 });
StudyGroupSchema.index({ isPrivate: 1 });

// Generate unique join code
StudyGroupSchema.pre('save', function(next) {
    if (this.isPrivate && !this.joinCode) {
        this.joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    next();
});

// Virtual for member count
StudyGroupSchema.virtual('memberCount').get(function() {
    return this.members.length;
});

// Virtual for active status
StudyGroupSchema.virtual('isActive').get(function() {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.stats.lastActivity > dayAgo;
});

module.exports = mongoose.model('StudyGroup', StudyGroupSchema);
