const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');
const { protect } = require('../middleware/auth');

// Get all flashcards
router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 10, subject, difficulty, search } = req.query;
        const query = { author: req.user._id };
        
        if (subject) query.subject = subject;
        if (difficulty) query.difficulty = difficulty;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { 'cards.front': { $regex: search, $options: 'i' } },
                { 'cards.back': { $regex: search, $options: 'i' } }
            ];
        }

        const flashcards = await Flashcard.find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Flashcard.countDocuments(query);

        res.json({
            success: true,
            flashcards,
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

// Get single flashcard
router.get('/:id', protect, async (req, res) => {
    try {
        const flashcard = await Flashcard.findOne({ _id: req.params.id, author: req.user._id })
            .populate('author', 'name email');
        
        if (!flashcard) {
            return res.status(404).json({ success: false, error: 'Flashcard not found' });
        }
        
        res.json({ success: true, flashcard });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new flashcard
router.post('/', protect, async (req, res) => {
    try {
        const flashcard = new Flashcard({
            ...req.body,
            author: req.user._id
        });
        
        await flashcard.save();
        res.status(201).json({ success: true, flashcard });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update flashcard
router.put('/:id', protect, async (req, res) => {
    try {
        const flashcard = await Flashcard.findOneAndUpdate(
            { _id: req.params.id, author: req.user._id },
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        
        if (!flashcard) {
            return res.status(404).json({ success: false, error: 'Flashcard not found' });
        }
        
        res.json({ success: true, flashcard });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete flashcard
router.delete('/:id', protect, async (req, res) => {
    try {
        const flashcard = await Flashcard.findOneAndDelete({ _id: req.params.id, author: req.user._id });
        
        if (!flashcard) {
            return res.status(404).json({ success: false, error: 'Flashcard not found' });
        }
        
        res.json({ success: true, message: 'Flashcard deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get public flashcards
router.get('/public', async (req, res) => {
    try {
        const { page = 1, limit = 10, subject, difficulty, search } = req.query;
        const query = { isPublic: true };
        
        if (subject) query.subject = subject;
        if (difficulty) query.difficulty = difficulty;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { 'cards.front': { $regex: search, $options: 'i' } },
                { 'cards.back': { $regex: search, $options: 'i' } }
            ];
        }

        const flashcards = await Flashcard.find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Flashcard.countDocuments(query);

        res.json({
            success: true,
            flashcards,
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

module.exports = router;
