const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { protect } = require('../middleware/auth');

// Get public quizzes (must be defined before /:id routes)
router.get('/public', async (req, res) => {
    try {
        const { page = 1, limit = 10, subject, difficulty, search } = req.query;
        const query = { isPublic: true };
        
        if (subject) query.subject = subject;
        if (difficulty) query.difficulty = difficulty;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const quizzes = await Quiz.find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Quiz.countDocuments(query);

        res.json({
            success: true,
            quizzes,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all quizzes
router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 10, subject, difficulty, search } = req.query;
        const query = { author: req.user._id };
        
        if (subject) query.subject = subject;
        if (difficulty) query.difficulty = difficulty;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const quizzes = await Quiz.find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Quiz.countDocuments(query);

        res.json({
            success: true,
            quizzes,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single quiz
router.get('/:id', protect, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ _id: req.params.id, author: req.user._id })
            .populate('author', 'name email');
        
        if (!quiz) {
            return res.status(404).json({ success: false, error: 'Quiz not found' });
        }
        
        res.json({ success: true, quiz });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new quiz
router.post('/', protect, async (req, res) => {
    try {
        const quiz = new Quiz({
            ...req.body,
            author: req.user._id
        });
        
        await quiz.save();
        res.status(201).json({ success: true, quiz });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update quiz
router.put('/:id', protect, async (req, res) => {
    try {
        const quiz = await Quiz.findOneAndUpdate(
            { _id: req.params.id, author: req.user._id },
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        
        if (!quiz) {
            return res.status(404).json({ success: false, error: 'Quiz not found' });
        }
        
        res.json({ success: true, quiz });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete quiz
router.delete('/:id', protect, async (req, res) => {
    try {
        const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, author: req.user._id });
        
        if (!quiz) {
            return res.status(404).json({ success: false, error: 'Quiz not found' });
        }
        
        res.json({ success: true, message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
