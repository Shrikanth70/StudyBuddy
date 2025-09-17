const express = require('express');
const router = express.Router();
const StudyGroup = require('../models/StudyGroup');
const { protect } = require('../middleware/auth');

// Get all study groups with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, subject, difficulty, search } = req.query;
        const filter = {};
        
        if (subject) filter.subject = subject;
        if (difficulty) filter.difficulty = difficulty;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } }
            ];
        }

        const groups = await StudyGroup.find(filter)
            .populate('createdBy', 'name profileImage')
            .populate('members.user', 'name profileImage')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await StudyGroup.countDocuments(filter);

        res.json({
            success: true,
            groups,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching study groups:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch study groups' });
    }
});

// Get single study group with full details
router.get('/:id', async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id)
            .populate('createdBy', 'name profileImage email')
            .populate('members.user', 'name profileImage email')
            .populate('resources.addedBy', 'name');

        if (!group) {
            return res.status(404).json({ success: false, error: 'Study group not found' });
        }

        res.json({ success: true, group });
    } catch (error) {
        console.error('Error fetching study group:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch study group' });
    }
});

// Create new study group
router.post('/', protect, async (req, res) => {
    try {
        const {
            name,
            description,
            subject,
            difficulty = 'all-levels',
            maxMembers = 50,
            isPrivate = false,
            tags = [],
            rules = []
        } = req.body;

        const newGroup = new StudyGroup({
            name,
            description,
            subject,
            difficulty,
            maxMembers,
            isPrivate,
            tags,
            rules,
            createdBy: req.user.id,
            members: [{
                user: req.user.id,
                role: 'admin'
            }]
        });

        await newGroup.save();
        
        const populatedGroup = await StudyGroup.findById(newGroup._id)
            .populate('createdBy', 'name profileImage')
            .populate('members.user', 'name profileImage');

        res.status(201).json({ success: true, group: populatedGroup });
    } catch (error) {
        console.error('Error creating study group:', error);
        res.status(500).json({ success: false, error: 'Failed to create study group' });
    }
});

// Update study group
router.put('/:id', protect, async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);
        
        if (!group) {
            return res.status(404).json({ success: false, error: 'Study group not found' });
        }

        // Check if user is admin
        const isAdmin = group.members.some(member => 
            member.user.toString() === req.user.id && member.role === 'admin'
        );
        
        if (!isAdmin) {
            return res.status(403).json({ success: false, error: 'Not authorized to update this group' });
        }

        const allowedUpdates = [
            'name', 'description', 'subject', 'difficulty', 'maxMembers',
            'isPrivate', 'tags', 'rules', 'settings'
        ];
        
        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const updatedGroup = await StudyGroup.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).populate('createdBy', 'name profileImage')
         .populate('members.user', 'name profileImage');

        res.json({ success: true, group: updatedGroup });
    } catch (error) {
        console.error('Error updating study group:', error);
        res.status(500).json({ success: false, error: 'Failed to update study group' });
    }
});

// Delete study group
router.delete('/:id', protect, async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);
        
        if (!group) {
            return res.status(404).json({ success: false, error: 'Study group not found' });
        }

        // Check if user is admin
        const isAdmin = group.members.some(member => 
            member.user.toString() === req.user.id && member.role === 'admin'
        );
        
        if (!isAdmin) {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this group' });
        }

        await StudyGroup.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Study group deleted successfully' });
    } catch (error) {
        console.error('Error deleting study group:', error);
        res.status(500).json({ success: false, error: 'Failed to delete study group' });
    }
});

// Join study group
router.post('/:id/join', protect, async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);
        
        if (!group) {
            return res.status(404).json({ success: false, error: 'Study group not found' });
        }

        // Check if already a member
        const isMember = group.members.some(member => 
            member.user.toString() === req.user.id
        );
        
        if (isMember) {
            return res.status(400).json({ success: false, error: 'Already a member of this group' });
        }

        // Check if group is full
        if (group.members.length >= group.maxMembers) {
            return res.status(400).json({ success: false, error: 'Group is full' });
        }

        // Check if private group requires approval
        if (group.isPrivate && group.settings.requireApproval) {
            return res.status(400).json({ 
                success: false, 
                error: 'This group requires approval to join' 
            });
        }

        group.members.push({
            user: req.user.id,
            role: 'member'
        });

        await group.save();
        
        const populatedGroup = await StudyGroup.findById(group._id)
            .populate('createdBy', 'name profileImage')
            .populate('members.user', 'name profileImage');

        res.json({ success: true, group: populatedGroup });
    } catch (error) {
        console.error('Error joining study group:', error);
        res.status(500).json({ success: false, error: 'Failed to join study group' });
    }
});

// Leave study group
router.post('/:id/leave', protect, async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);
        
        if (!group) {
            return res.status(404).json({ success: false, error: 'Study group not found' });
        }

        // Check if user is a member
        const memberIndex = group.members.findIndex(member => 
            member.user.toString() === req.user.id
        );
        
        if (memberIndex === -1) {
            return res.status(400).json({ success: false, error: 'Not a member of this group' });
        }

        // Prevent admin from leaving if they're the only admin
        const isAdmin = group.members[memberIndex].role === 'admin';
        const adminCount = group.members.filter(m => m.role === 'admin').length;
        
        if (isAdmin && adminCount === 1) {
            return res.status(400).json({ 
                success: false, 
                error: 'Cannot leave as the only admin. Please assign another admin first.' 
            });
        }

        group.members.splice(memberIndex, 1);
        await group.save();

        res.json({ success: true, message: 'Left study group successfully' });
    } catch (error) {
        console.error('Error leaving study group:', error);
        res.status(500).json({ success: false, error: 'Failed to leave study group' });
    }
});

// Add resource to study group
router.post('/:id/resources', protect, async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id);
        
        if (!group) {
            return res.status(404).json({ success: false, error: 'Study group not found' });
        }

        // Check if user is a member
        const isMember = group.members.some(member => 
            member.user.toString() === req.user.id
        );
        
        if (!isMember) {
            return res.status(403).json({ success: false, error: 'Not a member of this group' });
        }

        const { title, url, type } = req.body;
        
        group.resources.push({
            title,
            url,
            type,
            addedBy: req.user.id
        });

        await group.save();
        
        const populatedGroup = await StudyGroup.findById(group._id)
            .populate('resources.addedBy', 'name');

        res.json({ success: true, group: populatedGroup });
    } catch (error) {
        console.error('Error adding resource:', error);
        res.status(500).json({ success: false, error: 'Failed to add resource' });
    }
});

// Get user's study groups
router.get('/user/me', protect, async (req, res) => {
    try {
        const groups = await StudyGroup.find({ 'members.user': req.user.id })
            .populate('createdBy', 'name profileImage')
            .populate('members.user', 'name profileImage')
            .sort({ updatedAt: -1 });

        res.json({ success: true, groups });
    } catch (error) {
        console.error('Error fetching user study groups:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch user study groups' });
    }
});

module.exports = router;
