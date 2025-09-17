const express = require('express');
const router = express.Router();

// Sample study resources data
const studyResources = [
    {
        id: 1,
        title: "Khan Academy - Mathematics",
        description: "Comprehensive math courses from basic arithmetic to advanced calculus with interactive exercises and video lessons.",
        category: "Mathematics",
        difficulty: "Beginner to Advanced",
        link: "https://www.khanacademy.org/math",
        tags: ["math", "calculus", "algebra", "geometry"],
        rating: 4.8,
        duration: "Self-paced",
        format: "Video + Interactive"
    },
    {
        id: 2,
        title: "MIT OpenCourseWare",
        description: "Free access to MIT's course materials including lectures, assignments, and exams from actual MIT courses.",
        category: "Various Subjects",
        difficulty: "Advanced",
        link: "https://ocw.mit.edu/",
        tags: ["engineering", "science", "technology", "advanced"],
        rating: 4.9,
        duration: "Semester-based",
        format: "Course Materials"
    },
    {
        id: 3,
        title: "Coursera - Data Science",
        description: "Learn data science fundamentals including Python, statistics, machine learning, and data visualization.",
        category: "Computer Science",
        difficulty: "Intermediate",
        link: "https://www.coursera.org/specializations/data-science",
        tags: ["data-science", "python", "machine-learning", "statistics"],
        rating: 4.7,
        duration: "6 months",
        format: "Online Course"
    },
    {
        id: 4,
        title: "edX - Physics",
        description: "Explore physics concepts from mechanics to quantum physics with interactive simulations and problem sets.",
        category: "Physics",
        difficulty: "Intermediate to Advanced",
        link: "https://www.edx.org/learn/physics",
        tags: ["physics", "mechanics", "quantum", "simulations"],
        rating: 4.6,
        duration: "Self-paced",
        format: "Online Course + Labs"
    },
    {
        id: 5,
        title: "Duolingo - Language Learning",
        description: "Learn new languages through gamified lessons, practice exercises, and real-world conversations.",
        category: "Languages",
        difficulty: "Beginner to Intermediate",
        link: "https://www.duolingo.com/",
        tags: ["languages", "spanish", "french", "german", "japanese"],
        rating: 4.5,
        duration: "Daily practice",
        format: "Mobile App + Web"
    },
    {
        id: 6,
        title: "Wolfram Alpha",
        description: "Computational knowledge engine that provides step-by-step solutions to math, science, and engineering problems.",
        category: "Problem Solving",
        difficulty: "All Levels",
        link: "https://www.wolframalpha.com/",
        tags: ["problem-solving", "math", "science", "computational"],
        rating: 4.9,
        duration: "On-demand",
        format: "Web Tool"
    },
    {
        id: 7,
        title: "Quizlet - Study Tools",
        description: "Create flashcards, study sets, and practice tests for any subject with spaced repetition learning.",
        category: "Study Tools",
        difficulty: "All Levels",
        link: "https://quizlet.com/",
        tags: ["flashcards", "memorization", "study-tools", "spaced-repetition"],
        rating: 4.6,
        duration: "Flexible",
        format: "Web + Mobile App"
    },
    {
        id: 8,
        title: "TED-Ed - Educational Videos",
        description: "Curated educational videos on various topics with lesson plans and discussion questions.",
        category: "General Education",
        difficulty: "All Levels",
        link: "https://ed.ted.com/",
        tags: ["videos", "lessons", "discussions", "various-subjects"],
        rating: 4.7,
        duration: "5-20 minutes per video",
        format: "Video + Lesson Plans"
    }
];

// Get all resources
router.get('/', async (req, res) => {
    try {
        const { category, difficulty, search, tags } = req.query;
        let filteredResources = [...studyResources];

        // Filter by category
        if (category) {
            filteredResources = filteredResources.filter(resource => 
                resource.category.toLowerCase().includes(category.toLowerCase())
            );
        }

        // Filter by difficulty
        if (difficulty) {
            filteredResources = filteredResources.filter(resource => 
                resource.difficulty.toLowerCase().includes(difficulty.toLowerCase())
            );
        }

        // Search by title or description
        if (search) {
            const searchLower = search.toLowerCase();
            filteredResources = filteredResources.filter(resource => 
                resource.title.toLowerCase().includes(searchLower) ||
                resource.description.toLowerCase().includes(searchLower)
            );
        }

        // Filter by tags
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
            filteredResources = filteredResources.filter(resource => 
                resource.tags.some(tag => tagArray.includes(tag))
            );
        }

        res.json({
            success: true,
            resources: filteredResources,
            total: filteredResources.length,
            filters: { category, difficulty, search, tags }
        });

    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch resources' });
    }
});

// Get resource by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resource = studyResources.find(r => r.id === parseInt(id));

        if (!resource) {
            return res.status(404).json({ 
                success: false, 
                error: 'Resource not found' 
            });
        }

        res.json({
            success: true,
            resource
        });

    } catch (error) {
        console.error('Error fetching resource:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch resource' });
    }
});

// Get resources by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { difficulty, search } = req.query;

        let filteredResources = studyResources.filter(resource => 
            resource.category.toLowerCase().includes(category.toLowerCase())
        );

        // Additional filtering
        if (difficulty) {
            filteredResources = filteredResources.filter(resource => 
                resource.difficulty.toLowerCase().includes(difficulty.toLowerCase())
            );
        }

        if (search) {
            const searchLower = search.toLowerCase();
            filteredResources = filteredResources.filter(resource => 
                resource.title.toLowerCase().includes(searchLower) ||
                resource.description.toLowerCase().includes(searchLower)
            );
        }

        res.json({
            success: true,
            category,
            resources: filteredResources,
            total: filteredResources.length
        });

    } catch (error) {
        console.error('Error fetching resources by category:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch resources by category' });
    }
});

// Get resource categories
router.get('/categories/all', async (req, res) => {
    try {
        const categories = [...new Set(studyResources.map(resource => resource.category))];
        
        res.json({
            success: true,
            categories: categories.sort()
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
});

// Get resource difficulties
router.get('/difficulties/all', async (req, res) => {
    try {
        const difficulties = [...new Set(studyResources.map(resource => resource.difficulty))];
        
        res.json({
            success: true,
            difficulties: difficulties.sort()
        });

    } catch (error) {
        console.error('Error fetching difficulties:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch difficulties' });
    }
});

// Get popular resources (by rating)
router.get('/popular/top', async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        
        const popularResources = studyResources
            .sort((a, b) => b.rating - a.rating)
            .slice(0, parseInt(limit));

        res.json({
            success: true,
            resources: popularResources,
            total: popularResources.length
        });

    } catch (error) {
        console.error('Error fetching popular resources:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch popular resources' });
    }
});

// Search resources
router.get('/search/query', async (req, res) => {
    try {
        const { q, category, difficulty, format } = req.query;
        
        if (!q) {
            return res.status(400).json({ 
                success: false, 
                error: 'Search query is required' 
            });
        }

        let filteredResources = studyResources.filter(resource => {
            const matchesQuery = resource.title.toLowerCase().includes(q.toLowerCase()) ||
                               resource.description.toLowerCase().includes(q.toLowerCase()) ||
                               resource.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()));

            const matchesCategory = !category || resource.category.toLowerCase().includes(category.toLowerCase());
            const matchesDifficulty = !difficulty || resource.difficulty.toLowerCase().includes(difficulty.toLowerCase());
            const matchesFormat = !format || resource.format.toLowerCase().includes(format.toLowerCase());

            return matchesQuery && matchesCategory && matchesDifficulty && matchesFormat;
        });

        res.json({
            success: true,
            query: q,
            resources: filteredResources,
            total: filteredResources.length,
            filters: { category, difficulty, format }
        });

    } catch (error) {
        console.error('Error searching resources:', error);
        res.status(500).json({ success: false, error: 'Failed to search resources' });
    }
});

module.exports = router;
