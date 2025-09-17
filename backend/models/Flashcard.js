const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
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
    cards: [{
        front: {
            type: String,
            required: [true, 'Front side is required'],
            maxlength: [500, 'Front side cannot exceed 500 characters']
        },
        back: {
            type: String,
            required: [true, 'Back side is required'],
            maxlength: [1000, 'Back side cannot exceed 1000 characters']
        },
        hint: {
            type: String,
            maxlength: [200, 'Hint cannot exceed 200 characters']
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        },
        tags: [{
            type: String,
            trim: true
        }]
    }],
    settings: {
        randomizeOrder: {
            type: Boolean,
            default: true
        },
        showHints: {
            type: Boolean,
            default: true
        },
        reverseCards: {
            type: Boolean,
            default: false
        },
        autoAdvance: {
            type: Boolean,
            default: false
        },
        autoAdvanceDelay: {
            type: Number,
            default: 3
        }
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
    tags: [{
        type: String,
        trim: true
    }],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    stats: {
        totalCards: {
            type: Number,
            default: 0
        },
        masteredCards: {
            type: Number,
            default: 0
        },
        learningCards: {
            type: Number,
            default: 0
        },
        newCards: {
            type: Number,
            default: 0
        },
        totalReviews: {
            type: Number,
            default: 0
        },
        averageAccuracy: {
            type: Number,
            default: 0
        }
    },
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual for total cards
flashcardSchema.virtual('totalCards').get(function() {
    return this.cards.length;
});

// Update timestamps
flashcardSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    this.stats.totalCards = this.cards.length;
    next();
});

// Index for efficient searching
flashcardSchema.index({ title: 'text', subject: 'text', topic: 'text' });
flashcardSchema.index({ author: 1, createdAt: -1 });
flashcardSchema.index({ subject: 1, difficulty: 1 });
flashcardSchema.index({ tags: 1 });
flashcardSchema.index({ isPublic: 1, createdAt: -1 });

module.exports = mongoose.model('Flashcard', flashcardSchema);
