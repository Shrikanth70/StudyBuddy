const mongoose = require('mongoose');

const studyNoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        maxlength: [50000, 'Content cannot exceed 50000 characters']
    },
    summary: {
        type: String,
        maxlength: [1000, 'Summary cannot exceed 1000 characters']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    topic: {
        type: String,
        required: [true, 'Topic is required'],
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    type: {
        type: String,
        enum: ['note', 'summary', 'mindmap', 'cheatsheet', 'formula', 'definition'],
        default: 'note'
    },
    format: {
        type: String,
        enum: ['text', 'markdown', 'html', 'latex'],
        default: 'markdown'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    isShared: {
        type: Boolean,
        default: false
    },
    sharedWith: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        permission: {
            type: String,
            enum: ['read', 'write', 'admin'],
            default: 'read'
        }
    }],
    attachments: [{
        filename: String,
        url: String,
        type: String,
        size: Number
    }],
    aiGenerated: {
        type: Boolean,
        default: false
    },
    aiMetadata: {
        model: String,
        prompt: String,
        confidence: Number,
        processingTime: Number
    },
    version: {
        type: Number,
        default: 1
    },
    history: [{
        version: Number,
        content: String,
        changedAt: {
            type: Date,
            default: Date.now
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    exportSettings: {
        includeMetadata: {
            type: Boolean,
            default: true
        },
        includeTags: {
            type: Boolean,
            default: true
        },
        format: {
            type: String,
            enum: ['pdf', 'docx', 'txt', 'md'],
            default: 'pdf'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamps
studyNoteSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Index for efficient searching
studyNoteSchema.index({ title: 'text', content: 'text', subject: 'text', topic: 'text' });
studyNoteSchema.index({ author: 1, createdAt: -1 });
studyNoteSchema.index({ subject: 1, difficulty: 1 });
studyNoteSchema.index({ tags: 1 });
studyNoteSchema.index({ isPublic: 1, createdAt: -1 });

module.exports = mongoose.model('StudyNote', studyNoteSchema);
