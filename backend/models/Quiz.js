const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
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
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    questions: [{
        question: {
            type: String,
            required: true,
            maxlength: [1000, 'Question cannot exceed 1000 characters']
        },
        type: {
            type: String,
            enum: ['multiple-choice', 'true-false', 'short-answer', 'essay', 'fill-blank'],
            default: 'multiple-choice'
        },
        options: [{
            text: String,
            isCorrect: Boolean
        }],
        correctAnswer: {
            type: String,
            required: true
        },
        explanation: {
            type: String,
            maxlength: [2000, 'Explanation cannot exceed 2000 characters']
        },
        points: {
            type: Number,
            default: 1
        },
        timeLimit: {
            type: Number,
            default: 60
        }
    }],
    settings: {
        timeLimit: {
            type: Number,
            default: 0
        },
        randomizeQuestions: {
            type: Boolean,
            default: true
        },
        randomizeOptions: {
            type: Boolean,
            default: true
        },
        showCorrectAnswers: {
            type: Boolean,
            default: true
        },
        allowRetakes: {
            type: Boolean,
            default: true
        },
        passingScore: {
            type: Number,
            default: 70
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
    usageStats: {
        totalAttempts: {
            type: Number,
            default: 0
        },
        averageScore: {
            type: Number,
            default: 0
        },
        totalTimeSpent: {
            type: Number,
            default: 0
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
quizSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Index for efficient searching
quizSchema.index({ title: 'text', description: 'text', subject: 'text', topic: 'text' });
quizSchema.index({ author: 1, createdAt: -1 });
quizSchema.index({ subject: 1, difficulty: 1 });
quizSchema.index({ tags: 1 });
quizSchema.index({ isPublic: 1, createdAt: -1 });

module.exports = mongoose.model('Quiz', quizSchema);
